import re
from typing import List
import bson

import env
import os
from datetime import datetime
from functools import wraps

import jwt
from flask import Flask, request, make_response
from flask_cors import CORS
from jwt import DecodeError
from mongoengine import connect

from cal import get_event
from chatgpt import get_suggestions
from constant import SAMPLE_TEXT
from date import to_millis
from mail import send_welcome_mail
from mongo import m_to_d
from note import Note, get_user_notes, delete_note, get_all_public_notes, get_user_public_notes, \
    get_note, assign_slug
from user import get_user_by_email, User, get_user_by_id, get_user_by_username, get_blog_users, Setting

connect(host=os.environ['MONGO_CONN_STR'])
app = Flask(__name__)
CORS(app)


def get_hashtags(notes: List[Note]):
    hashtags = []
    for note in notes:
        hashtags += re.findall(r"\B(#[a-zA-Z_]+\b)(?!;)", note.text)
    return list(set(hashtags))


def hashtag_in_note(note: Note, hashtag: str):
    return hashtag in note.text


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('authorization').split(' ')[1]
        try:
            decoded = jwt.decode(
                jwt=token,
                key=os.environ['SUPABASE_PRIVATE_KEY'],
                algorithms=['HS256'],
                audience='authenticated'
            )
            user = get_user_by_email(decoded['email'])
            if user is None:
                user = User(email=decoded['email'], created_at=to_millis(datetime.now()))
                user.save()

                note = Note(
                    user_id=str(user.id),
                    title='Sample note',
                    text=SAMPLE_TEXT,
                    created_at=to_millis(datetime.now())
                )
                note.save()
                send_welcome_mail(user.email)
        except DecodeError:
            return '', 401
        return f(user, *args, **kwargs)
    return decorated_function


@app.route('/health')
def hello_world():
    return 'alive'


@app.route('/suggestions')
def handle_get_suggestions():
    topics = [t for t in request.args.get('topics', '').split(',') if len(t) > 0]
    if len(topics) == 0:
        return []
    return get_suggestions(topics)


@app.route('/event')
def handle_get_event():
    response = make_response(get_event(start_hour=21).decode())
    response.headers['Content-Type'] = 'text/calendar; charset=utf-8'
    return response


@app.route('/note', methods=['POST'])
@login_required
def handle_new_note(user: User):
    title = request.json['title']
    text = request.json['text']
    note_id = request.json.get('id')
    if not note_id:
        note = Note(
            user_id=str(user.id),
            created_at=to_millis(datetime.now()),
            title=title,
            text=text
        )
    else:
        note = get_note(note_id=note_id)
        note.title = title
        note.text = text
        if request.json.get('slate_value'):
            note.slate_value = request.json['slate_value']
    note.save()
    return note.to_dict(), 200


@app.route('/note')
@login_required
def handle_get_note(user: User):
    note = get_note(note_id=request.args['note_id'])
    if note.user_id != str(user.id):
        return '', 401
    return note.to_dict()


@app.route('/notes')
@login_required
def handle_get_notes(user: User):
    notes = get_user_notes(str(user.id))
    if request.args.get('hashtag'):
        notes = [n for n in notes if hashtag_in_note(n, '#'+request.args['hashtag'])]
    return [n.to_dict() for n in notes]


@app.route('/delete-note', methods=['DELETE'])
@login_required
def handle_delete_note(user: User):
    note = get_note(note_id=request.json['note_id'])
    if note.user_id != str(user.id):
        return '', 401
    delete_note(str(note.id))
    return note.to_dict()


@app.route('/note/visibility', methods=['POST'])
@login_required
def handle_update_note_visibility(user: User):
    note = get_note(note_id=request.json['note_id'])
    if note.user_id != str(user.id):
        return '', 401
    visibility = request.json['visibility']
    assert visibility in ['public', 'private']
    note.visibility = visibility
    note.save()
    if visibility == 'public' and note.slug is None:
        assign_slug(note)
    return note.to_dict()


@app.route('/setting', methods=['POST'])
@login_required
def handle_update_setting(user: User):
    if user.setting is None:
        user.setting = Setting()
    if request.json.get('write_font'):
        assert request.json['write_font'] in ['CourierPrime', 'PTSerif']
        user.setting.write_font = request.json['write_font']
    if request.json.get('blog_font'):
        assert request.json['blog_font'] in ['CourierPrime', 'PTSerif']
        user.setting.blog_font = request.json['blog_font']
    user.save()
    return m_to_d(user)


@app.route('/public/note')
def handle_get_public_note():
    note: Note = None
    if bson.objectid.ObjectId.is_valid(request.args['note_id']):
        note = get_note(note_id=request.args['note_id'])
    if note is None:
        note = get_note(slug=request.args['note_id'])
    if note is None:
        return '', 401
    if note.visibility != 'public':
        return '', 401
    user = get_user_by_id(note.user_id)
    return {
        'note': note.to_dict(),
        'user': user.get_public_dict()
    }


@app.route('/public/notes')
def handle_get_public_notes():
    notes = [n.to_dict() for n in get_all_public_notes()]
    return {
        'notes': notes,
        'users': [{'username': u.username} for u in get_blog_users()]
    }


@app.route('/public/user')
def handle_get_public_user():
    user = get_user_by_username(request.args['username'])
    if user is None:
        return '', 400
    notes = get_user_public_notes(str(user.id))
    notes = sorted(notes, key=lambda note: note.created_at, reverse=True)
    return {
        'user': user.get_public_dict(),
        'notes': [n.to_dict() for n in notes]
    }


@app.route('/user-home')
@login_required
def handle_get_user_home(user: User):
    notes = get_user_notes(str(user.id))
    return {
        'user': m_to_d(user),
        'notes': [n.to_dict() for n in notes],
        'hashtags': get_hashtags(notes)
    }


@app.route('/share/note', methods=['POST'])
def handle_post_share_note():
    note = Note(
        user_id='share',
        created_at=to_millis(datetime.now()),
        text=request.json.get('text'),
    )
    note.save()
    return note.to_dict()


@app.route('/share/note')
def handle_get_share_note():
    note = get_note(note_id=request.args['share_id'])
    if note.user_id != 'share':
        return '', 403
    return note.to_dict()
