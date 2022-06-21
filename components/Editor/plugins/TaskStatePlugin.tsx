import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

// TODO: does this even need to be a plugin?? ot sure
export function TaskStatePlugin(props: { task: any }): any {
  const { task } = props;
  const [editor] = useLexicalComposerContext();

  const editorState = JSON.stringify(editor.getEditorState());
  if (editorState != task.rawEditorState) {
    editor.setEditorState(editor.parseEditorState(task.rawEditorState));
  }

  return <></>;
}
