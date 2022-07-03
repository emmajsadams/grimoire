import ExampleTheme from '../utils/text/themes/ExampleTheme'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListNode, ListItemNode } from '@lexical/list'

export const DefaultConfig: any = {
  theme: ExampleTheme,
  onError(error: any) {
    throw error
  },
  nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode],
}
