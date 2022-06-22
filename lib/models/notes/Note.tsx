import styles from "../../../styles/Home.module.css";
import { TextView } from "../../utils/text/TextView";
import { TextEdit } from "../../utils/text/TextEdit";
import { makeOnChange } from "../../utils/text/plugins/OnChangePlugin";
import { TaskStatePlugin } from "../../utils/text/plugins/TaskStatePlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import React, { useState } from "react";
import { formatTimeAgo } from "../../utils/time/formatTimeAgo";
import { updateRecord } from "thin-backend";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function onClick(
  note: any,
  clientId: string,
  edit: boolean,
  setEdit: (newEdit: boolean) => any
) {
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
    return "Editing Here ";
  } else {
    if (note.clientId) {
      return "Editing Elsewhere ";
    } else if (note.draftRawEditorState) {
      return "Draft ";
    }
  }

  return "";
}

function getEditorState(note: any) {
  if (note.draftRawEditorState) {
    return note.draftRawEditorState;
  } else if (note.rawEditorState) {
    return note.rawEditorState;
  }

  return "";
}

// TODO: Consider a separate draft_updated_at status
// TODO: safe the draft as the primary version and create a history record
function saveNewVersion(note: any, setEdit: any): any {
  // TODO: Save the note in another table
  updateRecord("notes", note.id, {
    rawEditorState: note.draftRawEditorState,
    draftRawEditorState: "",
    version: note.version++,
    clientId: null,
  });
  setEdit(false);
}

function deleteDraft(note: any, setEdit: any): any {
  updateRecord("notes", note.id, {
    draftRawEditorState: "",
    clientId: null,
  });
  setEdit(false);
}

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
    let initialState = getEditorState(note);

    const editProps: any = initialState ? { initialState } : {};
    textElement = (
      <TextEdit {...editProps}>
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
  // TODO: IF there are no changes yet
  // TODO: figure out weird issues with text selection on omboiel
  return (
    <Card
      variant="outlined"
      sx={{ minWidth: 275 }}
      onClick={() => !edit && onClick(note, clientId, edit, setEdit)}
    >
      <CardContent>
        {textElement}
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {getStatus(note, edit) + `(${formatTimeAgo(note.updatedAt)})`}
        </Typography>
      </CardContent>
      <CardActions>
        {edit ? (
          <>
            <button onClick={() => saveNewVersion(note, setEdit)}>
              Save New Version
            </button>
            <br />
            <button onClick={() => onClick(note, clientId, edit, setEdit)}>
              Save Draft
            </button>
            <br />
            <button onClick={() => deleteDraft(note, setEdit)}>
              Delete Draft
            </button>
            <br />
          </>
        ) : (
          <></>
        )}
      </CardActions>
    </Card>
  );
}
