import React, { useState } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Link from 'next/link'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextareaAutosize from '@mui/material/TextareaAutosize'
import { useRouter } from 'next/router'

import { parseNote } from 'lib/notes/utils'
import { formatTimeAgo } from 'lib/datetime/utils'
import { getUpdateNoteTrigger, getNotes } from 'lib/notes/client'
import { Note } from 'lib/prisma/client'
import { AppProps } from 'pages/_app'

interface NotesProps extends AppProps {}

export function NotesList({ searchQuery }: NotesProps) {
  let query: any = null
  if (searchQuery && searchQuery.title && searchQuery.title.length > 0) {
    query = searchQuery.title[0].value // TODO: support the rest of the query schema? maybe just create the json query for primsa locally?
  }
  const { data, component } = getNotes(query) // TODO: update getNotes to use searchQuery
  if (component) {
    return component
  }
  const notes = data
  if (!notes) {
    return <p>Loading</p>
  }

  // TODO: on edit set task.clientID
  // TODO: on save or save as draft remove task.clientID
  // TODO: if task.clientID is set prevent editing and show a button to force the other user to stop editing the draft
  // This can be used to ensure only a single editing is happening at the same time.
  // TODO: Move create new note to app bar!
  // TODO: Investigate why textSearch: "" is necessarY?
  // TODO: I added a bunch of linebreaks hackily to make sure I can always view the bottom ote.
  // TODO: Add other properties? and header?
  // //           <TableHead>
  //           <TableRow>
  //             <TableCell>Title</TableCell>
  //           </TableRow>
  //         </TableHead>
  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableBody>
            {notes.map((note) => (
              <Link href={`/notes/${note.id}`} key={note.id}>
                <TableRow
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    'cursor': 'pointer',
                  }}
                >
                  <TableCell component="th" scope="row">
                    {note.title}{' '}
                    {note.due ? (
                      <b>{`(due ${formatTimeAgo(note.due as any)})`}</b>
                    ) : (
                      <></>
                    )}
                  </TableCell>
                </TableRow>
              </Link>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  )
}

const LOADING_COMPONENT = <p>Loading Note</p>

// TODO: Change this to automatically open edit view if a key is pressed, then close it if empty. Basically remove the delete draft button.
// TODO: automatically save draft every few seconds
// TODO: Convert this to two separate pages: ViewNote and EditNote
export function Note(props: {
  note: Note
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

  const saveNote = (localNote: any) => {
    delete localNote.error
    delete localNote.draft
    localNote.id = note.id
    localNote.version = note.version + 1
    updateNoteTrigger(localNote)
  }

  return (
    <Card variant="outlined" sx={{ minWidth: 275 }}>
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
              <b>Updated At:</b> {formatTimeAgo(note.updatedAt as any)}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              <b>Created On:</b> {formatTimeAgo(note.updatedAt as any)}
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
                saveNote(parsedNote)
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
            <Button
              onClick={() => {
                note.description += '\n status: done'
                saveNote(parseNote(note.description as any))
              }}
              disabled={note.status === 'done'}
            >
              Done
            </Button>
            <Button
              onClick={() => {
                router.push('/')
              }}
            >
              Home
            </Button>
          </>
        )}
      </CardActions>
    </Card>
  )
}
