import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import TreeViewPlugin from "../../utils/text/plugins/TreeViewPlugin";
import EmoticonPlugin from "../../utils/text/plugins/EmoticonPlugin";
import MyCustomAutoFocusPlugin from "../../utils/text/plugins/MyCustomAutoFocusPlugin";
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
export function TextEdit(props: {
  initialState: any;
  saveDraft: () => any;
  children: any;
}): JSX.Element {
  const { initialState, saveDraft, children } = props;

  return (
    <>
      <button onClick={saveDraft}>Save Draft as New Version</button>
      <LexicalComposer initialConfig={Config}>
        <div className="editor-container">
          <RichTextPlugin
            initialEditorState={initialState}
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
          />
          <MarkdownShortcutPlugin />
          <HistoryPlugin />
          <TreeViewPlugin />
          <EmoticonPlugin />
          <MyCustomAutoFocusPlugin />
          {children}
        </div>
      </LexicalComposer>
    </>
  );
}

function Placeholder() {
  return <div className="editor-placeholder">Enter some plain text...</div>;
}
