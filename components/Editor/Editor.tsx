import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import TreeViewPlugin from "./plugins/TreeViewPlugin";
import EmoticonPlugin from "./plugins/EmoticonPlugin";
import MyCustomAutoFocusPlugin from "./plugins/MyCustomAutoFocusPlugin";
import { Config } from "./Config";
import { makeOnChange } from "./onChange";

// TODO: Pull title from first header
export function Editor(props: { task: any }): JSX.Element {
  return (
    <LexicalComposer initialConfig={Config}>
      <div className="editor-container">
        <RichTextPlugin
          initialEditorState={props.task.rawEditorState}
          contentEditable={<ContentEditable className="editor-input" />}
          placeholder={<Placeholder />}
        />
        <MarkdownShortcutPlugin />
        <OnChangePlugin onChange={makeOnChange(props.task)} />
        <HistoryPlugin />
        <TreeViewPlugin />
        <EmoticonPlugin />
        <MyCustomAutoFocusPlugin />
      </div>
    </LexicalComposer>
  );
}

function Placeholder() {
  return <div className="editor-placeholder">Enter some plain text...</div>;
}
