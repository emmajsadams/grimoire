import styles from "../styles/Home.module.css";
import { query } from "thin-backend";
import { useQuery } from "thin-backend-react";
import { Editor } from "./Editor";

export function TasksList() {
  const tasks = useQuery(query("tasks").orderByDesc("createdAt"));

  if (tasks === null) {
    return <div>Loading ...</div>;
  }

  // TODO enable editor view only if user clicks edit?
  return (
    <div className={styles.grid}>
      {tasks.map((task, index) => (
        <div className={styles.card} key={task.id}>
          <Editor task={task} />
        </div>
      ))}
    </div>
  );
}
