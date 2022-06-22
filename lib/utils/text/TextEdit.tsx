import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import TreeViewPlugin from "../../utils/text/plugins/TreeViewPlugin";
import EmoticonPlugin from "../../utils/text/plugins/EmoticonPlugin";
import MyCustomAutoFocusPlugin from "../../utils/text/plugins/MyCustomAutoFocusPlugin";
import { makeOnChange } from "../../utils/text/plugins/OnChangePlugin";
import ExampleTheme from "../../utils/text/themes/ExampleTheme";
import { HeadingNode } from "@lexical/rich-text";
import React from "react";

// emoji node is broken EmojiNode
export const Config: any = {
  theme: ExampleTheme,
  onError(error: any) {
    throw error;
  },
  nodes: [HeadingNode], // TODO: Add rest of rich-text stuff here for markdown
};

// TODO: make param inputs generic separate from tasks
export function TextEdit(props: { task: any; setEdit: any }): JSX.Element {
  const { task, setEdit } = props;

  return (
    <>
      <button onClick={() => setEdit(false)}>Save Draft as New Version</button>
      <LexicalComposer initialConfig={Config}>
        <div className="editor-container">
          <RichTextPlugin
            initialEditorState={task.rawEditorState}
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
          />
          <MarkdownShortcutPlugin />
          {/* TODO I might need to make my own OnChangePlugin that handles updating the task state from other clients without triggering onChange handler lop */}
          <OnChangePlugin
            ignoreInitialChange={true}
            ignoreSelectionChange={true}
            onChange={makeOnChange(task)}
          />
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
