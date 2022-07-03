import { query } from 'thin-backend'
import { useQuery } from 'thin-backend-react'
import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Link from 'next/link'
import { AppProps } from '../../../pages/_app'
import { formatTimeAgo } from '../../utils/time/formatTimeAgo'
import { setQueryFilters } from '../../search'

interface NotesProps extends AppProps {}

export function NotesList({ searchQuery }: NotesProps) {
  // TODO: let orderby be set by filters???
  let notesQuery = query('notes').orderByAsc('due').orderByAsc('createdAt')
  if (searchQuery) {
    if (
      searchQuery.title.length == 0 ||
      searchQuery.title[0].operation !== '=='
    ) {
      alert('Invalid query this should never happen')
      searchQuery.errors.push('Invalid query this should never happen')
    } else {
      // TODO: move these loops into the query filters object
      for (const searchQueryPart of searchQuery.status) {
        notesQuery = setQueryFilters(notesQuery, searchQueryPart, 'status')
      }

      for (const searchQueryPart of searchQuery.due) {
        notesQuery = setQueryFilters(notesQuery, searchQueryPart, 'due')
      }

      for (const searchQueryPart of searchQuery.tag) {
        notesQuery = setQueryFilters(notesQuery, searchQueryPart, 'tag')
      }

      if (searchQuery.title[0].value !== '') {
        notesQuery = notesQuery.whereTextSearchStartsWith(
          'textSearch',
          searchQuery.title[0].value,
        )
      }
    }
  }

  const notes = useQuery(notesQuery)

  if (searchQuery.errors.length > 0) {
    return <p>Search Query Errors: {searchQuery.errors.join(', ')}</p>
  }

  if (notes === null) {
    return <div>Loading ...</div>
  }

  // TODO: Use clientID to mark which client is editing the draft.
  // TODO: on edit set task.clientID
  // TODO: on save or save as draft remove task.clientID
  // TODO: if task.clientID is set prevent editing and show a button to force the other user to stop editing the draft
  // This can be used to ensure only a single editing is happening at the same time.
  // TODO: Move create new note to app bar!
  // TODO: Investigate why textSearch: "" is necessarY?
  // TODO: I added a bunch of linebreaks hackily to make sure I can always view the bottom ote.
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Due</TableCell>
            </TableRow>
          </TableHead>
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
                    {note.title}
                  </TableCell>
                  <TableCell>{formatTimeAgo(note.due as any)}</TableCell>
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
