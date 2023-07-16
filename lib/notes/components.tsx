import React, { useState } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
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
import Head from 'next/head'

import { parseNote } from 'lib/notes/utils'
import { formatTimeAgo } from 'lib/datetime/utils'
import ClientOnly from 'lib/graphql/clientOnly'

interface NotesProps {
  searchQuery: string
}

const GET_NOTES_QUERY = gql`
  query GetNotes($data: NoteSearchInput!) {
    getNotes(data: $data) {
      id
      version
      ownerId
      description
      title
      status
      due
      allDay
      createdAt
      updatedAt
    }
  }
`

export function NotesCard({ searchQuery }: NotesProps) {
  const { data, loading, error } = useQuery(GET_NOTES_QUERY, {
    variables: {
      data: {
        title: searchQuery,
        status: 'todo',
      },
    },
  })
  if (loading) return <>Loading notes....</>
  if (error) return <>{`Loading notes error! ${error.message}`}</>

  const notes = data.getNotes
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
    <ClientOnly>
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
    </ClientOnly>
  )
}

const GET_NOTE_QUERY = gql`
  query GetNotes($data: NoteIdInput!) {
    getNote(data: $data) {
      id
      version
      ownerId
      description
      title
      status
      due
      allDay
      createdAt
      updatedAt
    }
  }
`

const UPDATE_NOTE_QUERY = gql`
  mutation UpdateNote($data: UpdateNoteInput!) {
    updateNote(data: $data) {
      id
      version
      ownerId
      description
      title
      status
      due
      allDay
      createdAt
      updatedAt
    }
  }
`

// TODO: Change this to automatically open edit view if a key is pressed, then close it if empty. Basically remove the delete draft button.
export function ViewNoteCard(props: { id: string }): JSX.Element {
  const router = useRouter()
  const { id } = props
  const [updateNote, updateNoteResponse] = useMutation(UPDATE_NOTE_QUERY)
  const { data, loading, error } = useQuery(GET_NOTE_QUERY, {
    variables: {
      data: {
        id: id,
      },
    },
  })
  if (updateNoteResponse.loading) return <>Updating note...</>
  if (updateNoteResponse.error)
    return <>{`Update note error! ${updateNoteResponse.error.message}`}</>
  if (loading) return <>Loading note....</>
  if (error) return <>{`Loading note error! ${error.message}`}</>
  const note = data.getNote

  const allDayText = note.allDay ? '(all day)' : ''
  const parsedNote = parseNote(note.description)

  const markNoteDone = () => {
    updateNote({
      variables: {
        data: {
          id: note.id,
          note: note.description + '\n status:done',
        },
      },
    })
    router.push('/notes/' + note.id)
  }

  return (
    <>
      <Head>
        <title>{note.title ? note.title : 'New Note'}</title>
      </Head>
      <Card variant="outlined" sx={{ minWidth: 275 }}>
        <CardContent>
          <p style={{ 'white-space': 'pre-line' } as any}>{note.description}</p>
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
          {parsedNote.due ? (
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              <b>Due:</b> {formatTimeAgo(parsedNote.due as any)} {allDayText}
            </Typography>
          ) : (
            <></>
          )}
        </CardContent>
        <CardActions>
          <Button onClick={() => router.push(`/notes/${note.id}?edit=true`)}>
            Edit
          </Button>
          <Button
            onClick={() => {
              markNoteDone()
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
        </CardActions>
      </Card>
    </>
  )
}

// TODO: Change this to automatically open edit view if a key is pressed, then close it if empty. Basically remove the delete draft button.
// TODO: automatically save draft every few seconds
export function EditNoteCard(props: { id: string }): JSX.Element {
  const { id } = props
  const router = useRouter()
  const [draft, setDraft] = useState('')
  const [updateNote, updateNoteResponse] = useMutation(UPDATE_NOTE_QUERY)
  const { data, loading, error } = useQuery(GET_NOTE_QUERY, {
    variables: {
      data: {
        id: id,
      },
    },
  })

  if (updateNoteResponse.loading) return <>Updating note...</>
  if (updateNoteResponse.error)
    return <>{`Update note error! ${updateNoteResponse.error.message}`}</>
  if (
    updateNoteResponse.called &&
    !updateNoteResponse.error &&
    !updateNoteResponse.loading
  )
    router.push('/notes/' + id)

  if (loading) return <>Loading notes....</>
  if (error) return <>{`Loading notes error! ${error.message}`}</>
  const note = data.getNote

  if (!draft) {
    setDraft(note.description || '# ')
  }

  const allDayText = note.allDay ? '(all day)' : ''
  const parsedNote = parseNote(draft)

  const saveNote = () => {
    updateNote({
      variables: {
        data: {
          id: note.id,
          note: draft,
        },
      },
    })
  }

  return (
    <>
      <Head>
        <title>{note.title ? note.title : 'New Note'}</title>
      </Head>
      <Card variant="outlined" sx={{ minWidth: 275 }}>
        <CardContent>
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
              <b>Due:</b> {formatTimeAgo(parsedNote.due as any)} {allDayText}
            </Typography>
          ) : (
            <></>
          )}
        </CardContent>
        <CardActions>
          <Button
            onClick={() => saveNote()}
            disabled={!!parsedNote.error || draft === note.description}
          >
            Save
          </Button>
        </CardActions>
      </Card>
    </>
  )
}
