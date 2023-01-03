import React, { useState } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextareaAutosize from '@mui/material/TextareaAutosize'
import { useRouter } from 'next/router'

import { parseNote } from 'lib/notes'
import { formatTimeAgo } from 'lib/datetime'
import { getUpdateNoteTrigger } from 'lib/notes/client'
import { Note } from 'lib/prisma/client'

const LOADING_COMPONENT = <p>Loading Note</p>

// TODO: Change this to automatically open edit view if a key is pressed, then close it if empty. Basically remove the delete draft button.
// TODO: automatically save draft every few seconds
// TODO: Convert this to two separate pages: ViewNote and EditNote
export function ViewNote(props: {
  note: Note
  clientId: string // TODO: Remove clientID concept
  edit: boolean // TODO: split this out into separate components instead of a flag
}): JSX.Element {
  const router = useRouter()
  const { note, edit } = props

  let draftText = ''
  if (edit) {
    draftText = note.description || '# '
  }

  const [draft, setDraft] = useState(draftText)
  const updateNoteTrigger = getUpdateNoteTrigger(note.id)

  if (!note) {
    return LOADING_COMPONENT
  }

  let textElement: JSX.Element
  if (!draft) {
    textElement = (
      <p style={{ 'white-space': 'pre-line' } as any}>{note.description}</p>
    )
  } else {
    textElement = (
      <TextareaAutosize
        aria-label="Note"
        placeholder="Empty"
        style={{ width: '100%' }}
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value)
        }}
      />
    )
  }

  const allDayText = note.allDay ? '(all day)' : ''
  const parsedNote = parseNote(draft)

  return (
    <Card
      variant="outlined"
      sx={{ minWidth: 275 }}
      onClick={() => {
        if (!draft) {
          setDraft(note?.description || '# ')
        }
      }}
    >
      <CardContent>
        {draft ? (
          <>
            {textElement}
            {parsedNote.error ? (
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                <b>Error:</b> {parsedNote.error}
              </Typography>
            ) : (
              <></>
            )}
            {parsedNote.due ? (
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                <b>Due:</b> {formatTimeAgo(parsedNote.due as any)} {allDayText}
              </Typography>
            ) : (
              <></>
            )}
          </>
        ) : (
          <>
            {textElement}
            {note.due ? (
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                <b>Due:</b> {formatTimeAgo(note.due as any)} {allDayText}
              </Typography>
            ) : (
              <></>
            )}
            {/* TODO: Change Last Updated to use history time instead */}
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              <b>Last Updated:</b> {formatTimeAgo(note.updatedAt as any)}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              <b>Version:</b> {note.version}
            </Typography>
          </>
        )}
      </CardContent>
      <CardActions>
        {draft ? (
          <>
            <Button
              onClick={() => {
                // TODO: Clean history and migrate it to use all this new stuff
                delete parsedNote.error
                delete parsedNote.draft
                parsedNote.id = note.id
                parsedNote.version = note.version + 1
                debugger
                updateNoteTrigger(parsedNote)
                setDraft('')
                router.push('/notes/' + note.id)
              }}
              disabled={!!parsedNote.error || draft === note.description}
            >
              Save
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => {
                if (!draft) {
                  setDraft(note?.description || '# ')
                }
              }}
              disabled={!!parsedNote.error || draft === note.description}
            >
              Edit
            </Button>
          </>
        )}
      </CardActions>
    </Card>
  )
}
