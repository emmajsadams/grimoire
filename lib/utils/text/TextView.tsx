import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import ExampleTheme from "./themes/ExampleTheme";
import { HeadingNode } from "@lexical/rich-text";
import { TaskStatePlugin } from "./plugins/TaskStatePlugin";

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

export function TextView(props: { task: any; setEdit: any }): JSX.Element {
  const { task, setEdit } = props;

  return (
    <>
      <button onClick={() => setEdit(true)}>Edit Draft</button>
      <LexicalComposer initialConfig={Config}>
        <div className="editor-container">
          <RichTextPlugin
            initialEditorState={props.task.rawEditorState}
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder=""
          />
          <TaskStatePlugin task={task} />
        </div>
      </LexicalComposer>
    </>
  );
}
