import Clickable from "../components/Clickable";
import Goal from "./Goal";
import Streak from "./Streak";
import Suggestions from "./Suggestions";
import Topics from "./Topics";
import Event from "../components/Event";
import useFetch from "../useFetch";
import { Note } from "../type";
import { useContext, useEffect } from "react";
import { API_HOST } from "../config";
import { AppContext } from "../components/AppContext";
import { FullLoader } from "../comps/Loading";
import { Helmet } from "react-helmet";
import Hashtags from "./Hashtags";

const pad = (num: number) => {
  return num < 10 ? "0" + num : num;
};

const formatDate = (dateTime: Date) => {
  return [
    dateTime.getUTCFullYear(),
    pad(dateTime.getUTCMonth() + 1),
    pad(dateTime.getUTCDate()),
    "T",
    pad(dateTime.getUTCHours()),
    pad(dateTime.getUTCMinutes()) + "00Z",
  ].join("");
};

const Home = () => {
  const { user, setNotes } = useContext(AppContext);
  const homeApi = useFetch<{ notes: Note[]; hashtags: string[] }>();

  useEffect(() => {
    if (homeApi.response) {
      const coll: Record<string, Note> = {};
      for (const note of homeApi.response.notes) {
        coll[note.id] = note;
      }
      setNotes(coll);
    }
  }, [homeApi.response]);

  useEffect(() => {
    if (user) {
      (() => {
        homeApi.handle(
          fetch(`${API_HOST}/user-home`, {
            headers: {
              Authorization: `Bearer ${user!.token}`,
            },
          })
        );
      })();
    }
  }, [user]);

  const handleAddToGoogleCalendar = () => {
    const dayStart = new Date();
    dayStart.setHours(0, 0, 0, 0);
    const start = dayStart.getTime() + 21 * 60 * 60 * 1000;
    const end = start + 60 * 60 * 1000;

    const parts = [
      "action=TEMPLATE",
      "dates=" + formatDate(new Date(start)) + "/" + formatDate(new Date(end)),
      "text=Write on Retro Note",
      "location=Retro Note",
      "recur=RRULE:FREQ%3DDAILY;INTERVAL%3D1",
    ];
    Event.track("add_to_calendar");
    window.open(
      "https://calendar.google.com/calendar/event?" + parts.join("&"),
      "_blank"
    );
  };

  if (!homeApi.response) {
    return <FullLoader />;
  }

  return (
    <div className="flex flex-col-reverse lg:flex-row lg:space-x-6">
      <Helmet>
        <title>Home - Retro Note</title>
      </Helmet>
      <div className="lg:w-9/12 space-y-6">
        {homeApi.response?.hashtags && homeApi.response.hashtags.length > 0 && (
          <Hashtags hashtags={homeApi.response.hashtags} />
        )}
        <Suggestions />
      </div>
      <div className="lg:w-3/12 space-y-6 mb-6">
        <div>
          <Clickable
            className="text-lg"
            lite={false}
            onClick={handleAddToGoogleCalendar}
          >
            Add reminder &rarr;
          </Clickable>
          <div className="text-sm opacity-50">
            Adjust the timing accordingly
          </div>
        </div>
        <Streak />
        <Goal />
        <Topics />
      </div>
    </div>
  );
};

export default Home;
