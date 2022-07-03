import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { DefaultConfig } from '../../text'

export const Config: any = {
  ...DefaultConfig,
  readOnly: true,
}

export function TextView(props: { children: any }): JSX.Element {
  const { children } = props

  // TODO: use clientID to change buttons.
  return (
    <LexicalComposer initialConfig={Config}>
      <div className="editor-container">
        <RichTextPlugin
          contentEditable={<ContentEditable className="editor-input" />}
          placeholder=""
        />
        {children}
      </div>
    </LexicalComposer>
  )
}
