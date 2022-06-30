import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import ExampleTheme from '../../utils/text/themes/ExampleTheme'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import React from 'react'

export const Config: any = {
  theme: ExampleTheme,
  onError(error: any) {
    throw error
  },
  nodes: [HeadingNode, QuoteNode],
}

// TODO: Look into collobartion plugin
export function TextEdit(props: {
  initialState: any
  children: any
}): JSX.Element {
  const { initialState, children } = props

  return (
    <LexicalComposer initialConfig={Config}>
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
