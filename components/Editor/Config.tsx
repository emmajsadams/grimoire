import { EmojiNode } from "./nodes/EmojiNode";
import ExampleTheme from "./themes/ExampleTheme";

export const Config: any = {
  theme: ExampleTheme,
  onError(error: any) {
    throw error;
  },
  nodes: [EmojiNode],
};
