import {
  STATUSES_TYPE,
  TAGS_TYPE,
  TITLE_PROPERTY,
  DUE_PROPERTY,
  TAG_PROPERTY,
  STATUS_PROPERTY,
} from 'lib/notes/constants'
import { Moment } from 'moment-timezone'

export const Operations = ['==', '!=', '>', '<', '>=', '<=']
export type Operation = '==' | '!=' | '>' | '<' | '>=' | '<='

export interface TitleQueryPart {
  operation: Operation
  value: string
}

export interface DueQueryPart {
  operation: Operation
  value: Moment
}

export interface StatusQueryPart {
  operation: Operation
  value: STATUSES_TYPE
}

export interface TagQueryPart {
  operation: Operation
  value: TAGS_TYPE
}

export interface Query {
  [TITLE_PROPERTY]: TitleQueryPart[]
  [DUE_PROPERTY]: DueQueryPart[]
  [STATUS_PROPERTY]: StatusQueryPart[]
  [TAG_PROPERTY]: TagQueryPart[]
  errors: string[]
  rawQuery: string
}
