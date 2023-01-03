import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Link from 'next/link'

import { AppProps } from 'pages/_app'
import { formatTimeAgo } from 'lib/datetime'
import { getNotes } from 'lib/notes/client'

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
