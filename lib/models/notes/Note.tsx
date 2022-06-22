import styles from "../../../styles/Home.module.css";
import { TextView } from "../../utils/text/TextView";
import { TextEdit } from "../../utils/text/TextEdit";
import { makeOnChange } from "../../utils/text/plugins/OnChangePlugin";
import { TaskStatePlugin } from "../../utils/text/plugins/TaskStatePlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import React, { useState } from "react";
import { formatTimeAgo } from "../../utils/time/formatTimeAgo";
import { updateRecord } from "thin-backend";

function onClick(
  note: any,
  clientId: string,
  edit: boolean,
  setEdit: (newEdit: boolean) => any
) {
  debugger;
  if (edit) {
    updateRecord("notes", note.id, { clientId: null });
    setEdit(false);
  } else {
    updateRecord("notes", note.id, { clientId: clientId });
    setEdit(true);
  }
}

function getStatus(note: any, edit: boolean): string {
  if (edit) {
    return "Editing";
  } else {
    if (note.clientId) {
      return "Editing (in another Window)";
    } else if (note.draftRawEditorState) {
      return "Draft";
    }
  }

  return "";
}

// TODO: safe the draft as the primary version and create a history record
function saveNewVersion(): any {}

// TODO: Prevent duplicate edits with a simple flag that checks if any client is editing
export function Note(props: { note: any; clientId: any }): JSX.Element {
  const { note, clientId } = props;
  const [edit, setEdit] = useState(false);

  if (!note) {
    return <p>Loading Note</p>;
  }

  // Cancel out of edit if another window takes focus
  if (clientId != note.clientId && edit) {
    setEdit(false);
  }

  let textElement: JSX.Element;
  if (!edit) {
    textElement = (
      <TextView>
        <TaskStatePlugin note={note} />
      </TextView>
    );
  } else {
    const initialState: any = note.rawEditorState
      ? { initialState: note.rawEditorState }
      : {};
    textElement = (
      <TextEdit {...initialState}>
        {/* TODO I might need to make my own OnChangePlugin that handles updating the task state from other clients without triggering onChange handler lop */}
        <OnChangePlugin
          ignoreInitialChange={true}
          ignoreSelectionChange={true}
          onChange={makeOnChange(note)}
        />
      </TextEdit>
    );
  }

  // TODO: Add a draft_raw_entity_state column and use that in edit. Also use it to add (Draft)
  // TODO: Handle onClick anywhere updating edit status
  return (
    <div
      className={styles.card}
      onClick={() => onClick(note, clientId, edit, setEdit)}
    >
      {textElement}
      <hr />

      {edit ? (
        <>
          <button onClick={() => saveNewVersion()}>Save New Version</button>
          <br />
          <button onClick={() => onClick(note, clientId, edit, setEdit)}>
            Save Draft
          </button>
          <br />
        </>
      ) : (
        <></>
      )}
      <span>
        {formatTimeAgo(note.updatedAt)}
        <br />
        {getStatus(note, edit)}
      </span>
    </div>
  );
}
