import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import TreeViewPlugin from "./plugins/TreeViewPlugin";
import EmoticonPlugin from "./plugins/EmoticonPlugin";
import MyCustomAutoFocusPlugin from "./plugins/MyCustomAutoFocusPlugin";
import { makeOnChange } from "./onChange";
import ExampleTheme from "./themes/ExampleTheme";
import { HeadingNode } from "@lexical/rich-text";
import { Viewer } from "./Viewer";
import React, { useState } from "react";

// emoji node is broken EmojiNode
export const Config: any = {
  theme: ExampleTheme,
  onError(error: any) {
    throw error;
  },
  nodes: [HeadingNode], // TODO: Add rest of rich-text stuff here for markdown
};

// TODO: Convert this to a TaskView Component
export function Editor(props: { task: any }): JSX.Element {
  const { task } = props;
  const [edit, setEdit] = useState(false);

  // TODO// convert this to a TextView component
  if (!edit) {
    return (
      <>
        <button onClick={() => setEdit(true)}>Edit</button>
        <Viewer task={task} />
      </>
    );
  }

  // TODO// convert this to a TextEdit component
  return (
    <>
      <button onClick={() => setEdit(false)}>Save</button>
      <LexicalComposer initialConfig={Config}>
        <div className="editor-container">
          <RichTextPlugin
            initialEditorState={task.rawEditorState}
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
          />
          <MarkdownShortcutPlugin />
          <OnChangePlugin onChange={makeOnChange(task)} />
          <HistoryPlugin />
          <TreeViewPlugin />
          <EmoticonPlugin />
          <MyCustomAutoFocusPlugin />
        </div>
      </LexicalComposer>
    </>
  );
}

function Placeholder() {
  return <div className="editor-placeholder">Enter some plain text...</div>;
}
