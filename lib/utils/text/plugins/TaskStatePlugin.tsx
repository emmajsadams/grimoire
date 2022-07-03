import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

// TODO: does this even need to be a plugin?? ot sure
// TODO: Rename this to be related ot notes.
export function TaskStatePlugin(props: { note: any }): any {
  const { note } = props
  const [editor] = useLexicalComposerContext()

  // No editor exists yet
  if (!editor) {
    return
  }

  // Editor state has not changed
  const editorState = JSON.stringify(editor.getEditorState())
  if (editorState == note.rawEditorState) {
    return
  }

  // This is a unique case where there is no value at all. We can just safely ignore this for now. Even an "empty"
  // editor state should have content. This can only happen when first creating a note
  if (!note.rawEditorState) {
    return
  }

  // Else parse and set the state
  editor.setEditorState(editor.parseEditorState(note.rawEditorState))

  return <></>
}
