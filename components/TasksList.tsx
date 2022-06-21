import styles from "../styles/Home.module.css";
import { query } from "thin-backend";
import { useQuery } from "thin-backend-react";
import { Editor } from "./Editor";

// TODO: Use a Thin data.subscription to keep these up to date
export function TasksList() {
  // TODO: according to docs this should setp a subscription, but it doesn't seem to update with multiple clients
  // NOTE: It does seem to be updating the separate properties sooooo hmmm
  const tasks = useQuery(query("tasks").orderByDesc("createdAt"));

  if (tasks === null) {
    return <div>Loading ...</div>;
  }

  // TODO enable editor view only if user clicks edit?
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
