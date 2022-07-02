import { TextView } from '../../utils/text/TextView'
import { TextEdit } from '../../utils/text/TextEdit'
import { makeOnChange } from '../../utils/text/plugins/OnChangePlugin'
import { TaskStatePlugin } from '../../utils/text/plugins/TaskStatePlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import React, { useState } from 'react'
import { formatTimeAgo } from '../../utils/time/formatTimeAgo'
import { updateRecord, createRecord, Note as NoteType } from 'thin-backend'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

function onClick(
  note: NoteType,
  clientId: string,
  edit: boolean,
  setEdit: (newEdit: boolean) => any,
) {
  if (edit) {
    updateRecord('notes', note.id, { clientId: null })
    setEdit(false)
  } else {
    updateRecord('notes', note.id, { clientId: clientId })
    setEdit(true)
  }
}

function getStatus(note: NoteType, edit: boolean): string {
  if (edit) {
    return 'Editing Here '
  } else {
    if (note.clientId) {
      return 'Editing Elsewhere '
    } else if (note.draftRawEditorState) {
      return 'Draft '
    }
  }

  return ''
}

function getEditorState(note: NoteType) {
  if (note.draftRawEditorState) {
    return note.draftRawEditorState
  } else if (note.rawEditorState) {
    return note.rawEditorState
  }

  return ''
}

async function saveNewVersion(
  note: NoteType,
  setEdit: (edit: boolean) => void,
): Promise<any> {
  const parsedNote: Partial<NoteType> = JSON.parse(note.draftParsedNote) as any
  if (parsedNote.error) {
    alert(
      'This should never happen since the save button should be disabled. Please refresh your client.',
    )
    return
  }

  createRecord('notes_history', {
    noteId: note.id,
    rawEditorState: note.rawEditorState,
    version: note.version,
  })
  updateRecord('notes', note.id, {
    rawEditorState: note.draftRawEditorState,
    draftRawEditorState: '',
    version: note.version++,
    clientId: null,
    ...parsedNote,
  })
  setEdit(false)
}

function deleteDraft(note: NoteType, setEdit: any): any {
  updateRecord('notes', note.id, {
    draftRawEditorState: '',
    error: '',
    clientId: null,
  })
  setEdit(false)
}

export function Note(props: { note: NoteType; clientId: string }): JSX.Element {
  const { note, clientId } = props
  const [edit, setEdit] = useState(false)

  if (!note) {
    return <p>Loading Note</p>
  }

  // Cancel out of edit if another window takes focus
  if (clientId != note.clientId && edit) {
    setEdit(false)
  }

  let textElement: JSX.Element
  if (!edit) {
    textElement = (
      <TextView>
        <TaskStatePlugin note={note} />
      </TextView>
    )
  } else {
    let initialState = getEditorState(note)

    const editProps: any = initialState ? { initialState } : {}
    textElement = (
      <TextEdit {...editProps}>
        {/* TODO I might need to make my own OnChangePlugin that handles updating the task state from other clients without triggering onChange handler lop */}
        <OnChangePlugin
          ignoreInitialChange={true}
          ignoreSelectionChange={true}
          onChange={makeOnChange(note)}
        />
      </TextEdit>
    )
  }

  // TODO: Handle onClick anywhere updating edit status
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
        {note.error ? (
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            <b>Error:</b> {note.error}
          </Typography>
        ) : (
          <></>
        )}
      </CardContent>
      <CardActions>
        {edit ? (
          <>
            <Button
              onClick={() => saveNewVersion(note, setEdit)}
              disabled={!!note.error || !note.draftRawEditorState}
            >
              Save New Version
            </Button>
            <Button onClick={() => onClick(note, clientId, edit, setEdit)}>
              Save Draft
            </Button>
            <Button onClick={() => deleteDraft(note, setEdit)}>
              Delete Draft
            </Button>
          </>
        ) : (
          <></>
        )}
      </CardActions>
    </Card>
  )
}
