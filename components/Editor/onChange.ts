import { AnyARecord } from "dns";
import { $getRoot, $getSelection } from "lexical";
// Add this import
import { updateRecord, getCurrentUserId } from "thin-backend";

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
export function makeOnChange(task: any): any {
  return function (editorState: any) {
    editorState.read(() => {
      // // Read the contents of the EditorState here.
      // const root = $getRoot();
      // const selection = $getSelection();

      // console.log(, root, selection);

      const description = JSON.stringify(editorState);
      updateRecord("tasks", task.id, {
        description,
        // userId: getCurrentUserId(),
      });
    });
  };
}
