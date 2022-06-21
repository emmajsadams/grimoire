import { EmojiNode } from "./nodes/EmojiNode";
import ExampleTheme from "./themes/ExampleTheme";
import { HeadingNode } from "@lexical/rich-text";

// emoji node is broken EmojiNode
export const Config: any = {
  theme: ExampleTheme,
  onError(error: any) {
    throw error;
  },
  nodes: [HeadingNode], // TODO: Add rest of rich-text stuff here for markdown
};
