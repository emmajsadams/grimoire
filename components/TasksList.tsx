import styles from "../styles/Home.module.css";
import { query } from "thin-backend";
import { useQuery } from "thin-backend-react";
import { Editor } from "./Editor";

// TODO: Create a separat tags entity. then retrieve a mapping of them with usequery once and use that
export function TasksList(props: { clientID: string }) {
  const { clientID } = props;
  // TODO: according to docs this should setp a subscription, but it doesn't seem to update with multiple clients
  // NOTE: It does seem to be updating the separate properties sooooo hmmm
  const tasks = useQuery(query("tasks").orderByDesc("createdAt"));
  console.log(clientID);

  if (tasks === null) {
    return <div>Loading ...</div>;
  }

  // TODO: Use clientID to mark which client is editing the draft.
  // TODO: on edit set task.clientID
  // TODO: on save or save as draft remove task.clientID
  // TODO: if task.clientID is set prevent editing and show a button to force the other user to stop editing the draft
  // This can be used to ensure only a single editing is happening at the same time.
  return (
    <div className={styles.grid}>
      {tasks.map((task) => (
        <div className={styles.card} key={task.id}>
          <Editor task={task} />
          <hr />
          <p>{task.updatedAt}</p>
        </div>
      ))}
    </div>
  );
}
