import moment from "moment";
import { ParsedListText, parseListText } from "./Core/List";
import { focus } from "src/Note";
import { SavedNote } from "./type";

export type TimelineItem = {
  note: SavedNote;
  date: Date;
  type: "note" | "mention";
  future: boolean;
  text?: string;
  listParsed?: ParsedListText;
  dateStr?: string;
};

export type HeatmapStrip = {
  size: number;
  heat: number;
  items: TimelineItem[];
  start: Date;
  end: Date;
};

const isFuture = (dt: Date) => {
  return moment(dt).isAfter(new Date());
};

const getPara = (text: string, idx: number) => {
  let start = idx;
  let end = idx;
  while (start > 0) {
    if (text[start] === "\n") {
      start += 1;
      break;
    }
    start -= 1;
  }
  while (end < text.length) {
    if (text[end] === "\n") {
      end -= 1;
      break;
    }
    end += 1;
  }
  return text.substring(start, end);
};

export const getTimeline = (notes: SavedNote[]) => {
  let items: TimelineItem[] = [];
  for (const note of notes) {
    const date = new Date(note.created_at);
    items.push({
      note,
      date,
      type: "note",
      future: isFuture(date),
    });

    for (const match of Array.from(
      note.text.matchAll(/@(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/g)
    )) {
      if (match.index !== undefined) {
        const para = getPara(note.text, match.index);

        let { focused } = focus(note.text, match.index, match[0], 400);

        const listParsed = parseListText(para);
        if (listParsed) {
          focused = listParsed.content;
        }

        const date = moment(match[1]).toDate();
        items.push({
          note,
          date,
          type: "mention",
          future: isFuture(date),
          text: focused,
          listParsed,
          dateStr: match[1],
        });
      }
    }
  }
  return items.sort((a, b) => a.date.getTime() - b.date.getTime());
};

export const getImageAddresses = (text: string) => {
  return Array.from(
    text.matchAll(/\!\[.*\]\(attachment\:\/\/([^\)\[\"\']+)( ".*")?\)/g)
  ).map((m) => m[1]);
};
