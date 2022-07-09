import { $getRoot } from "lexical";
import { updateRecord } from "thin-backend";
import { parseNote } from "../../../notes/parseNote";

// TODO: Do I need this full editor state??? or is it ok to have something else with just the root nodes
// TODO: Is tasks the right name? Maybe notes?
// TODO: Add some sort of delay on updating this all the time (or make sure pugin handles it)
// TODO: quickly check editor state and unless it differs bail on all updates
// TODO: Consider a separate draft_updated_at status
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
export function makeOnChange(note: any): any {
  return function (editorState: any) {
    editorState.read(() => {
      const root = $getRoot();
      const textNodes = root.getAllTextNodes();

      // We don't want to update all the properties for the note while it is a draft, we only
      // want to update the draft editor state and the current error.
      const parsedNote = parseNote(textNodes);
      updateRecord("notes", note.id, {
        draftRawEditorState: JSON.stringify(editorState),
        draftParsedNote: JSON.stringify(parsedNote),
        error: parsedNote.error,
      });
    });
  };
}

// TODO!!!! use this code to write a custom onchange handler
//
// /**
//  * Copyright (c) Meta Platforms, Inc. and affiliates.
//  *
//  * This source code is licensed under the MIT license found in the
//  * LICENSE file in the root directory of this source tree.
//  */
// 'use strict';

// var LexicalComposerContext = require('@lexical/react/LexicalComposerContext');
// var react = require('react');

// /**
//  * Copyright (c) Meta Platforms, Inc. and affiliates.
//  *
//  * This source code is licensed under the MIT license found in the
//  * LICENSE file in the root directory of this source tree.
//  *
//  */
// const CAN_USE_DOM = typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined';

// /**
//  * Copyright (c) Meta Platforms, Inc. and affiliates.
//  *
//  * This source code is licensed under the MIT license found in the
//  * LICENSE file in the root directory of this source tree.
//  *
//  */
// const useLayoutEffectImpl = CAN_USE_DOM ? react.useLayoutEffect : react.useEffect;
// var useLayoutEffect = useLayoutEffectImpl;

// /**
//  * Copyright (c) Meta Platforms, Inc. and affiliates.
//  *
//  * This source code is licensed under the MIT license found in the
//  * LICENSE file in the root directory of this source tree.
//  *
//  */
// function OnChangePlugin({
//   ignoreInitialChange = true,
//   ignoreSelectionChange = false,
//   onChange
// }) {
//   const [editor] = LexicalComposerContext.useLexicalComposerContext();
//   useLayoutEffect(() => {
//     if (onChange) {
//       return editor.registerUpdateListener(({
//         editorState,
//         dirtyElements,
//         dirtyLeaves,
//         prevEditorState
//       }) => {
//         if (ignoreSelectionChange && dirtyElements.size === 0 && dirtyLeaves.size === 0) {
//           return;
//         }

//         if (ignoreInitialChange && prevEditorState.isEmpty()) {
//           return;
//         }

//         onChange(editorState, editor);
//       });
//     }
//   }, [editor, ignoreInitialChange, ignoreSelectionChange, onChange]);
//   return null;
// }

// exports.OnChangePlugin = OnChangePlugin;
