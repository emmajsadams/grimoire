import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import React from 'react'
import { DefaultConfig } from '../../text'

// TODO: Look into collobartion plugin
export function TextEdit(props: {
  initialState: any
  children: any
}): JSX.Element {
  const { initialState, children } = props

  return (
    <LexicalComposer initialConfig={DefaultConfig}>
      <div className="editor-container">
        <RichTextPlugin
          initialEditorState={initialState}
          contentEditable={<ContentEditable className="editor-input" />}
          placeholder={<></>}
        />
        <MarkdownShortcutPlugin />
        {children}
      </div>
    </LexicalComposer>
  )
}
