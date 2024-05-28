# NoteYourself

Thanks [@pskd73][pskd] for the [RetroNote][rn] app I'd been enjoying for quite
a while. I wanted a convenient note-taking app I could use across devices, and
this filled the niche perfectly for me. I'm grateful that @pskd73 made the app
freely available as [likh][likh].

So now I'll need time to figure things out before I can properly self-host the
app on my own terms. Plenty of learning to be done on the web dev front, since
my previous web projects were just static sites.

## Overview

I can see at least three main components, a Python backend in `server/`, a web
frontend in `web-public/`, and a separate `web-app/`, all of which we must get
running before the app can usefully record notes.

### Python Development

To work on the backend, create and activate a virtual environment then install
the packages from `requirements.txt`:

```bash
VENV_LOCATION="${HOME}/.virtualenvs"
python -m venv ${VENV_LOCATION}/notes
source ${VENV_LOCATION}/notes/bin/activate
pip install -r server/requirements.txt
```

[pskd]: https://github.com/pskd73
[rn]:   https://app.retronote.app/
[likh]: https://github.com/pskd73/likh
