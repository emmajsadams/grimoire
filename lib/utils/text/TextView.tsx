import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import ExampleTheme from "./themes/ExampleTheme";
import { HeadingNode } from "@lexical/rich-text";

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

export function TextView(props: {
  clientID: any;
  editDraft: () => any;
  children: any;
}): JSX.Element {
  const { editDraft, children } = props;

  // TODO: use clientID to change buttons.
  return (
    <>
      <button onClick={editDraft}>Edit Draft</button>
      <LexicalComposer initialConfig={Config}>
        <div className="editor-container">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder=""
          />
          {children}
        </div>
      </LexicalComposer>
    </>
  );
}
