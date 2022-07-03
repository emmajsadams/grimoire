// TODO: Move this to some constants file
export const DONE = 'done'
export type DONE_TYPE = 'done'
export const TODO = 'todo'
export type TODO_TYPE = 'todo'
export const DELETED = 'deleted'
export type DELETED_TYPE = 'deleted'
export const STATUSES = [DONE, TODO, DELETED]
export type STATUSES_TYPE = DONE_TYPE | TODO_TYPE | DELETED_TYPE
export const STATUS_PROPERTY = 'status'
export type STATUS_PROPERTY_TYPE = 'status'

export const TITLE_PROPERTY = 'title'
export type TITLE_PROPERTY_TYPE = 'title'

export const DUE_PROPERTY = 'due'
export type DUE_PROPERTY_TYPE = 'due'

export const CAREER_TAG = 'career'
export type CAREER_TAG_TYPE = 'career'
export const FINANCE_TAG = 'finance'
export type FINANCE_TAG_TYPE = 'finance'
export const TAGS = [CAREER_TAG, FINANCE_TAG]
export type TAGS_TYPE = CAREER_TAG_TYPE | FINANCE_TAG_TYPE
export const TAG_PROPERTY = 'tag'
export type TAG_PROPERTY_TYPE = 'tag'

export const Properties = [
  STATUS_PROPERTY,
  TITLE_PROPERTY,
  DUE_PROPERTY,
  TAG_PROPERTY,
]
export type Properties_TYPE =
  | TITLE_PROPERTY_TYPE
  | DUE_PROPERTY_TYPE
  | TAG_PROPERTY_TYPE
  | STATUS_PROPERTY_TYPE
