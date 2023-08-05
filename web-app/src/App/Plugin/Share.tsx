import CryptoJS from "crypto-js";
import { useContext, useEffect, useState } from "react";
import { RNPluginCreator } from "./type";
import { EditorContext, EditorContextType } from "../Context";
import { textToTitle } from "src/Note";
import {
  BiCopy,
  BiEdit,
  BiFile,
  BiLoaderAlt,
  BiShare,
  BiShareAlt,
} from "react-icons/bi";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "src/comps/Button";
import moment from "moment";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getDownloadableNote } from "../File";
import { Loader } from "src/comps/Loading";
import Event from "src/components/Event";
import { CustomEditor } from "../Core/Core";
import { SavedNote } from "../type";

const HOST = "https://api.retronote.app";

function generateRandomString(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

function encrypt(text: string, secret: string) {
  return CryptoJS.AES.encrypt(text, secret).toString();
}

function decrypt(text: string, secret: string) {
  var bytes = CryptoJS.AES.decrypt(text, secret);
  return bytes.toString(CryptoJS.enc.Utf8);
}

const shareNote = async (
  text: string
): Promise<{ _id: string; created_at: number }> => {
  const res = await fetch(`${HOST}/share/note`, {
    method: "POST",
    body: JSON.stringify({ text }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await res.json();
};

const getShared = async (
  shareId: string
): Promise<{ _id: string; created_at: number; text: string }> => {
  const res = await fetch(`${HOST}/share/note?share_id=${shareId}`);
  return await res.json();
};

const SaveAsNote = ({ text }: { text: string }) => {
  const navigate = useNavigate();
  const { newNote } = useContext(EditorContext);

  const handleClick = () => {
    const note = newNote({ text });
    navigate(`/write/note/${note?.id}`);
  };

  return (
    <Button className="flex items-center space-x-2" onClick={handleClick}>
      <BiEdit />
      <span>Save as note</span>
    </Button>
  );
};

const NotePage = () => {
  const [search] = useSearchParams();
  const { usePluginState, allNotes, storage } = useContext(EditorContext);
  const [state, setState] = usePluginState<{ shares?: Record<string, string> }>(
    "share"
  );
  const [shared, setShared] = useState<{
    created_at: number;
  }>();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const noteId = search.get("noteId");
  const note = noteId ? allNotes[noteId] : undefined;
  const shareKey = noteId ? (state?.shares || {})[noteId] : undefined;

  useEffect(() => {
    (async () => {
      if (shareKey) {
        setLoading(true);
        const decoded = atob(shareKey);
        const [shareId] = decoded.split("|");
        const sharedNote = await getShared(shareId);
        setShared({ created_at: sharedNote.created_at });
        setLoading(false);
      } else {
        setLoading(false);
      }
    })();
  }, [shareKey]);

  const share = async () => {
    if (note) {
      setLoading(true);
      const downloadableNote = await getDownloadableNote(note, storage.pouch);

      let text = downloadableNote.text;
      const secret = generateRandomString(10);
      text = encrypt(text, secret);
      console.log("encrypted", text);

      const json = await shareNote(text);
      const shareKey = btoa(`${json._id}|${secret}`);

      Event.track("share");
      setLoading(false);
      setState({
        ...state,
        shares: { ...(state.shares || {}), [note.id]: shareKey },
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `https://app.retronote.app/write/plugin/share?shareKey=${shareKey}`
    );
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <div>
      {note && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span>
                <BiFile />
              </span>
              <span className="font-bold">{textToTitle(note.text, 50)}</span>
            </div>
            <div className="space-x-2">
              <div className="space-x-2 inline-block">
                <Button
                  onClick={share}
                  className="flex items-center space-x-2"
                  disabled={loading}
                >
                  <BiShare />
                  <span>{loading ? "Loading" : "Share now"}</span>
                </Button>
              </div>
            </div>
          </div>

          {shared && (
            <div className="flex items-center space-x-2">
              <span>
                Shared {moment(new Date(shared.created_at)).fromNow()}
              </span>
              <Button
                className="text-xs flex items-center space-x-2"
                onClick={handleCopy}
                disabled={copied}
              >
                <BiCopy />
                <span>{copied ? "Copied!" : "Copy link"}</span>
              </Button>
            </div>
          )}
        </div>
      )}
      <div className="text-sm text-primary text-opacity-50 mt-10 max-w-sm">
        * The shared note will be encrypted and only people who know the link
        can decrypt it
      </div>
    </div>
  );
};

const SharePage = () => {
  const [search] = useSearchParams();
  const shareKey = search.get("shareKey");
  const [shared, setShared] = useState<{ text: string }>();

  useEffect(() => {
    (async () => {
      if (shareKey) {
        const decoded = atob(shareKey);
        const [shareId, secret] = decoded.split("|");
        const sharedNote = await getShared(shareId);
        const text = decrypt(sharedNote.text, secret);
        setShared({ text });
      }
    })();
  }, [shareKey]);

  return (
    <div>
      {shared ? (
        <div className="mb-20">
          <SaveAsNote text={shared.text} />
          <div className="prose my-6">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {shared.text}
            </ReactMarkdown>
          </div>
          <SaveAsNote text={shared.text} />
        </div>
      ) : (
        <div
          className="w-full flex justify-center items-center"
          style={{ height: "calc(100vh - 80px)" }}
        >
          <Loader />
        </div>
      )}
    </div>
  );
};

const Page = () => {
  const [search] = useSearchParams();

  if (search.get("noteId")) {
    return <NotePage />;
  }
  if (search.get("shareKey")) {
    return <SharePage />;
  }

  return null;
};

let editorState: EditorContextType | null = null;
let copied = false;
let loading = false;

const SharePlugin: RNPluginCreator = () => {
  const getStateItem = (key: string): any => {
    const [state] = editorState!.usePluginState<{
      shares?: Record<string, string>;
    }>("share");
    return state.shares![key];
  };

  const setStateItem = (key: string, value: any): any => {
    const [state, setState] = editorState!.usePluginState<{
      shares?: Record<string, string>;
    }>("share");
    setState({
      ...state,
      shares: { ...(state.shares || {}), [key]: value },
    });
  };

  return {
    name: "Share",
    version: 1,
    updateState(_editorState) {
      editorState = _editorState;
    },
    page: {
      url: "share",
      element: <Page />,
    },
    noteStatuBarIcons: {
      share: (note) => ({
        icon: (
          <span>
            {loading ? (
              <BiLoaderAlt className="animate-spin" />
            ) : (
              <BiShareAlt />
            )}
          </span>
        ),
        tooltop: {
          text: copied ? "Link copied!" : "Share",
          force: copied ? true : undefined,
        },
        onClick: async (e, navigate) => {
          if (!editorState) return;
          loading = true;
          setStateItem("updated", new Date().getTime());

          const downloadableNote = await getDownloadableNote(
            note,
            editorState.storage.pouch
          );

          let text = downloadableNote.text;
          const secret = generateRandomString(10);
          text = encrypt(text, secret);

          const json = await shareNote(text);
          const shareKey = btoa(`${json._id}|${secret}`);

          Event.track("share");

          navigator.clipboard.writeText(
            `https://app.retronote.app/write/plugin/share?shareKey=${shareKey}`
          );
          loading = false;
          copied = true;
          setStateItem(note.id, shareKey);
          setTimeout(() => {
            copied = false;
            setStateItem("updated", new Date().getTime());
          }, 3000);
        },
      }),
    },
  };
};

export default SharePlugin;