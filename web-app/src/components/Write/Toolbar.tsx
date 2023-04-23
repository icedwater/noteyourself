import * as React from "react";
import { useContext } from "react";
import { AppContext } from "../AppContext";
import Clickable from "../Clickable";
import TextCount from "./TextCount";
import Toolbar from "../Toolbar";
import { getIntroNote } from "./Intro";
import TrayExpandIcon from "../TrayExpandIcon";

const WriteToolbar = () => {
  const appContext = useContext(AppContext);

  const handleNewNote = () => {
    const note = appContext.newNote();
    appContext.setEditingNoteId(note.id);
  };

  const handleFocus = () => {
    appContext.setFocusMode(!appContext.focusMode);
  };

  const handleTitleClick = () => {
    appContext.setActiveTray("write");
    appContext.setTrayOpen(!appContext.trayOpen);
  };

  return (
    <Toolbar>
      <Toolbar.Title>
        <Clickable>
          <span onClick={handleTitleClick}>
            <TrayExpandIcon />
            Retro Note
          </span>
        </Clickable>
      </Toolbar.Title>

      <Toolbar.MenuList>
        {!appContext.focusMode && (
          <>
            <li>
              <Clickable lite>
                <span onClick={() => appContext.toggleTextMetricType()}>
                  <TextCount />
                </span>
              </Clickable>
            </li>
            {/* <li>
              <Clickable lite>
                <span
                  onClick={() => appContext.setTrayOpen(!appContext.trayOpen)}
                >
                  more
                </span>
              </Clickable>
            </li> */}
            <li onClick={handleNewNote}>
              <Clickable lite>
                <span>new</span>
              </Clickable>
            </li>
          </>
        )}
        <li onClick={handleFocus}>
          <Clickable lite>
            <span>{appContext.focusMode ? "relax" : "focus"}</span>
          </Clickable>
        </li>
      </Toolbar.MenuList>
    </Toolbar>
  );
};

export default WriteToolbar;
