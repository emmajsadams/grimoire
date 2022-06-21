import styles from "../styles/Home.module.css";
import { query } from "thin-backend";
import { useQuery } from "thin-backend-react";

export function TasksList() {
  const tasks = useQuery(query("tasks").orderByDesc("createdAt"));

  if (tasks === null) {
    return <div>Loading ...</div>;
  }

  return (
    <div className={styles.grid}>
      {tasks.map((task) => (
        <div className={styles.card}>
          <h2>{task.title}</h2>
          <p>{task.description}</p>
        </div>
      ))}
    </div>
  );
}
