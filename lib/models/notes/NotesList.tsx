import styles from "../../../styles/Home.module.css";
import { query } from "thin-backend";
import { useQuery } from "thin-backend-react";
import { Note } from "./Note";
import { createRecord } from "thin-backend";

// TODO: Create a separat tags entity. then retrieve a mapping of them with usequery once and use that
export function NotesList(props: { clientId: string }) {
  const { clientId } = props;
  const tags = useQuery(query("tags"));
  const notes = useQuery(query("notes").orderByDesc("createdAt"));

  if (notes === null) {
    return <div>Loading ...</div>;
  }

  // TODO: Use clientID to mark which client is editing the draft.
  // TODO: on edit set task.clientID
  // TODO: on save or save as draft remove task.clientID
  // TODO: if task.clientID is set prevent editing and show a button to force the other user to stop editing the draft
  // This can be used to ensure only a single editing is happening at the same time.
  return (
    <>
      <button onClick={() => createRecord("notes", {})}>Create New Note</button>

      <div className={styles.grid}>
        {notes.map((note) => (
          <Note note={note} clientId={clientId} key={note.id} />
        ))}
      </div>
    </>
  );
}
