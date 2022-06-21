import { AnyARecord } from "dns";
import { $getRoot, $getSelection } from "lexical";
import { text } from "stream/consumers";
// Add this import
import { updateRecord, getCurrentUserId } from "thin-backend";

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
export function makeOnChange(task: any): any {
  return function (editorState: any) {
    editorState.read(() => {
      // // Read the contents of the EditorState here.

      // const selection = $getSelection();

      // console.log(, root, selection);

      const root = $getRoot();
      const textNodes = root.getAllTextNodes();
      let title: string | undefined;
      if (textNodes.length > 0) {
        title = textNodes.shift()?.getTextContent();
      }

      // parse rest of text as description
      let description: string | undefined;
      if (textNodes.length > 0) {
        description = "";
        for (const textNode of textNodes) {
          console.log(textNode);
          description += textNode.getTextContent() + " \n ";
        }
      }

      // TODO: Do I need this full editor state??? or is it ok to have something else with just the root nodes
      const rawEditorState = JSON.stringify(editorState);

      // TODO: Consider how to store history?? separate field? are there limits
      const newTask = {
        rawEditorState,
        title,
        description,
        // TODO: Add Parser for `Due: ....`
        // TODO: Add Parser for `Tags: ....`
        // TODO: Add Parser for `Recurring: Weekly|Monthly`
        // TODO: Add Parser for Done (maybe a [x] at the end or beginning of title)

        // userId: getCurrentUserId(),
      };

      console.log(newTask);

      updateRecord("tasks", task.id, newTask);
    });
  };
}
