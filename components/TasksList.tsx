import styles from "../styles/Home.module.css";
import { query } from "thin-backend";
import { useQuery } from "thin-backend-react";
import { Editor } from "./Editor";

export function TasksList() {
  const tasks = useQuery(query("tasks").orderByDesc("createdAt"));

  if (tasks === null) {
    return <div>Loading ...</div>;
  }

  return (
    <div className={styles.grid}>
      {tasks.map((task) => (
        <div className={styles.card} key={task.title}>
          <h2>{task.title}</h2>
          <Editor task={task} />
        </div>
      ))}
    </div>
  );
}
