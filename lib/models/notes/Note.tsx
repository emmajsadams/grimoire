import styles from "../../../styles/Home.module.css";
import { TextView } from "../../utils/text/TextView";
import { TextEdit } from "../../utils/text/TextEdit";
import { makeOnChange } from "../../utils/text/plugins/OnChangePlugin";
import { TaskStatePlugin } from "../../utils/text/plugins/TaskStatePlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import React, { useState } from "react";

// TODO: Prevent duplicate edits with a simple flag that checks if any client is editing
export function Note(props: { note: any; clientID: any }): JSX.Element {
  const { note, clientID } = props;
  const [edit, setEdit] = useState(false);

  let textElement: JSX.Element;
  if (!edit) {
    textElement = (
      <TextView clientID={clientID} editDraft={() => setEdit(true)}>
        <TaskStatePlugin note={note} />
      </TextView>
    );
  } else {
    const initialState: any = note.rawEditorState
      ? { initialState: note.rawEditorState }
      : {};
    textElement = (
      <TextEdit saveDraft={() => setEdit(false)} {...initialState}>
        {/* TODO I might need to make my own OnChangePlugin that handles updating the task state from other clients without triggering onChange handler lop */}
        <OnChangePlugin
          ignoreInitialChange={true}
          ignoreSelectionChange={true}
          onChange={makeOnChange(note)}
        />
      </TextEdit>
    );
  }

  return (
    <div className={styles.card}>
      {textElement}
      <hr />
      <p>{note.updatedAt}</p>
    </div>
  );
}
