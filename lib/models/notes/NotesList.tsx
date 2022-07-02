import { query } from 'thin-backend'
import { useQuery } from 'thin-backend-react'
import { Note } from './Note'
import Stack from '@mui/material/Stack'
import { DELETED } from './parseNote'

interface NotesProps {
  clientId: string
  searchQuery: string
  setSearchQuery: (query: string) => void
}

// TODO: add some padding at the bottom so navigation doesn't cover up last card
export function NotesList({ clientId, searchQuery }: NotesProps) {
  let notesQuery = query('notes')
    .whereNot('status', DELETED)
    .orderByAsc('due')
    .orderByAsc('createdAt')
  if (searchQuery) {
    // TODO: Denormalize all tags into a field on the note for full text search
    notesQuery = notesQuery.whereTextSearchStartsWith('textSearch', searchQuery)
  }

  const notes = useQuery(notesQuery)

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
      <Stack spacing={2}>
        {notes.map((note) => (
          <Note note={note} clientId={clientId} key={note.id} />
        ))}
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </Stack>
    </>
  )
}
