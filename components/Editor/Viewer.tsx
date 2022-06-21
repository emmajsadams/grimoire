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

// emoji node is broken EmojiNode
export const Config: any = {
  readOnly: true,

  // TODO: Consolidate configs, stuff below is identical
  theme: ExampleTheme,
  onError(error: any) {
    throw error;
  },
  nodes: [HeadingNode], // TODO: Add rest of rich-text stuff here for markdown
};

export function Viewer(props: { task: any }): JSX.Element {
  return (
    <LexicalComposer initialConfig={Config}>
      <div className="editor-container">
        <RichTextPlugin
          initialEditorState={props.task.rawEditorState}
          contentEditable={<ContentEditable className="editor-input" />}
          placeholder=""
        />
      </div>
    </LexicalComposer>
  );
}
