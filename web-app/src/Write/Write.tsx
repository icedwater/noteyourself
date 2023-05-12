import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../components/AppContext";
import Editor from "../components/Write/Editor";
import { Note } from "../type";
import useFetch from "../useFetch";
import { API_HOST } from "../config";
import { useParams } from "react-router-dom";
import TextCounter from "./TextCounter";
import GoalTracker from "./GoalTracker";
import Clickable from "../components/Clickable";
import MEditor from "../comps/MEditor";
import { FullLoader } from "../comps/Loading";

const useTimer = <T extends unknown>(callback: (state: T | null) => void) => {
  const ref = useRef<NodeJS.Timeout | null>(null);
  const state = useRef<T | null>(null);

  const update = (_state: T) => {
    state.current = _state;
    if (!ref.current) {
      ref.current = setTimeout(() => {
        callback(state.current);
        ref.current = null;
      }, 1000);
    }
  };

  return {
    update,
  };
};

const Write = () => {
  const noteApi = useFetch<Note>();
  const saveFetch = useFetch();
  const { user, focusMode, setFocusMode } = useContext(AppContext);
  const [note, setNote] = useState<Note>();
  const { noteId } = useParams();

  const timer = useTimer<Note>((_note) => {
    if (_note) {
      saveFetch.handle(
        fetch(`${API_HOST}/note`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user!.token}`,
          },
          body: JSON.stringify({
            id: _note.id,
            title: _note.title,
            text: _note.text,
            slate_value: _note.slate_value,
          }),
        })
      );
    }
  });

  useEffect(() => {
    setFocusMode(true);
    return () => setFocusMode(false);
  }, []);

  useEffect(() => {
    if (noteApi.response) {
      setNote(noteApi.response);
    }
  }, [noteApi.response]);

  useEffect(() => {
    if (user) {
      noteApi.handle(
        fetch(`${API_HOST}/note?note_id=${noteId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
      );
    }
  }, [noteId, user]);

  const handleNoteChange = (newNote: Note) => {
    timer.update(newNote);
    setNote(newNote);
  };

  const handleFocus = () => {
    setFocusMode((f) => !f);
  };

  const handleMChange = (serialized: string, text: string) => {
    if (note) {
      const newNote = { ...note, text, slate_value: serialized };
      timer.update(newNote);
      setNote(newNote);
    }
  };

  if (noteApi.loading) {
    return <FullLoader />;
  }

  return (
    <div className="h-full">
      {note && (
        <>
          {/* <Editor note={note} onChange={handleNoteChange} /> */}
          <MEditor
            onChange={({ serialized, text }) => handleMChange(serialized, text)}
            initValue={note.slate_value}
            initText={note.text}
          />
          <div className="fixed bottom-0 right-0 px-4 py-2 flex space-x-4">
            {!focusMode && (
              <>
                <GoalTracker note={note} />
                <span className="opacity-50 w-14 text-center">
                  <TextCounter note={note} />
                </span>
              </>
            )}
            <Clickable lite onClick={handleFocus}>
              {focusMode ? "relax" : "focus"}
            </Clickable>
          </div>
        </>
      )}
    </div>
  );
};

export default Write;
