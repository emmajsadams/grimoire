import React, { useState } from 'react'
import { updateRecord, createRecord, Note as NoteType } from 'thin-backend'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextareaAutosize from '@mui/material/TextareaAutosize'

import { parseNote } from 'lib/notes'
import { formatTimeAgo } from 'lib/datetime'

const LOADING_COMPONENT = <p>Loading Note</p>

// TODO: automatically save draft every few seconds
export function EditNote(props: {
  note: NoteType
  clientId: string
}): JSX.Element {
  const { note } = props
  const [draft, setDraft] = useState(note.draft)

  if (!note) {
    return LOADING_COMPONENT
  }

  const allDayText = note.allDay ? '(all day)' : ''
  const parsedNote = parseNote(draft)

  return (
    <Card
      variant="outlined"
      sx={{ minWidth: 275 }}
      onClick={() => {
        if (!draft) {
          setDraft(note.description)
        }
      }}
    >
      <CardContent>
        <>
          <TextareaAutosize
            aria-label="Note"
            placeholder="Empty"
            style={{ width: '100%' }}
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value)
            }}
          />
          {parsedNote.error ? (
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              <b>Error:</b> {parsedNote.error}
            </Typography>
          ) : (
            <></>
          )}
          {parsedNote.due ? (
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              <b>Due:</b> {formatTimeAgo(parsedNote.due)} {allDayText}
            </Typography>
          ) : (
            <></>
          )}
        </>
      </CardContent>
      <CardActions>
        <>
          <Button
            onClick={() => {
              // TODO: Clean history and migrate it to use all this new stuff
              parsedNote.draft = ''
              parsedNote.version = note.version + 1
              updateRecord('notes', note.id, parsedNote)
              createRecord('notes_history', {
                noteId: note.id,
                rawEditorState: parsedNote.description,
                version: parsedNote.version,
              } as any)
              setDraft('')
            }}
            disabled={!!parsedNote.error || draft === note.description}
          >
            Save New Version
          </Button>
          <Button
            onClick={() => {
              updateRecord('notes', note.id, { draft: draft })
            }}
          >
            Save Draft
          </Button>
          <Button
            onClick={() => {
              updateRecord('notes', note.id, { draft: '' })
              setDraft('')
            }}
          >
            Delete Draft
          </Button>
        </>
      </CardActions>
    </Card>
  )
}