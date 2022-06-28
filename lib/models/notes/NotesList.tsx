import styles from "../../../styles/Home.module.css";
import { query } from "thin-backend";
import { useQuery } from "thin-backend-react";
import { Note } from "./Note";
import { createRecord } from "thin-backend";
import Stack from "@mui/material/Stack";

interface NotesProps {
  clientId: string; // TODO: Move clientID to app
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

// TODO: Create a separat tags entity. then retrieve a mapping of them with usequery once and use that
export function NotesList({ clientId, searchQuery }: NotesProps) {
  const tags = useQuery(query("tags")); // TODO: maybe just delete a separate tags entity and store it as text. Can always iterate through and rewrite.

  let notesQuery = query("notes").orderByDesc("createdAt");
  if (searchQuery) {
    // TODO: Denormalize all tags into a field on the note for full text search
    notesQuery = notesQuery.whereTextSearchStartsWith(
      "textSearch",
      searchQuery
    );
  }

  const notes = useQuery(notesQuery);

  if (notes === null) {
    return <div>Loading ...</div>;
  }

  // TODO: Use clientID to mark which client is editing the draft.
  // TODO: on edit set task.clientID
  // TODO: on save or save as draft remove task.clientID
  // TODO: if task.clientID is set prevent editing and show a button to force the other user to stop editing the draft
  // This can be used to ensure only a single editing is happening at the same time.
  // TODO: Move create new note to app bar!
  // TODO: Investigate why textSearch: "" is necessarY?
  return (
    <>
      <button onClick={() => createRecord("notes", { textSearch: "" })}>
        Create New Note
      </button>

      <Stack spacing={2}>
        {notes.map((note) => (
          <Note note={note} clientId={clientId} key={note.id} />
        ))}
      </Stack>
    </>
  );
}
