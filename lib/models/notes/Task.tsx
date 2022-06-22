import styles from "../../../styles/Home.module.css";
import { TextView } from "../../utils/text/TextView";
import { TextEdit } from "../../utils/text/TextEdit";

import React, { useState } from "react";

// TODO: Prevent duplicate edits with a simple flag that checks if any client is editing
export function Task(props: { task: any }): JSX.Element {
  const { task } = props;
  const [edit, setEdit] = useState(false);

  let textElement: JSX.Element;
  if (!edit) {
    textElement = <TextView task={task} setEdit={setEdit} />;
  } else {
    textElement = <TextEdit task={task} setEdit={setEdit} />;
  }

  return (
    <div className={styles.card} key={task.id}>
      {textElement}
      <hr />
      <p>{task.updatedAt}</p>
    </div>
  );
}
