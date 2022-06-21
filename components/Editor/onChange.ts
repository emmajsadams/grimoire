import { $getRoot, $getSelection } from "lexical";
// Add this import
import { updateRecord, getCurrentUserId } from "thin-backend";

// TODO: Is tasks the right name? Maybe notes?
// TODO: Add some sort of delay on updating this all the time (or make sure pugin handles it)
export function makeOnChange(task: any): any {
  return function (editorState: any) {
    // TODO: quickly check editor state and unless it differs bail on all updates
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

      // TODO: Consider how to store history??
      //  * I would say a separate history table that mirrors current tasks schemea
      //  * add version column to both
      //  * current version and all past versions are stored in history table
      //  * draft is created in history table and editor shows the draft always
      //  * save as draft button is added
      //  * all updates happen in realtime to draft
      //  * allow lexical local history to be used
      //  * once save is clicked main version is updated to draft version
      // TODO: make sure updates from multiple clients work
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
