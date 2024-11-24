import moment from 'moment-timezone'

import { STATUS_PROPERTY, DUE_PROPERTY, STATUSES } from 'lib/notes/constants'
import { isDate, parseDate } from 'lib/datetime/utils'

const IGNORED_TITLE_PREFIXES = ['#', '##', '###']

const ANYTIME_SYNONYMS = [
  'anytime',
  'whenever',
  'eventually',
  'any time',
  'at any time',
  'someday',
  'soon',
  'some day',
]

// TODO: let users set parser plugins via ui. basically make this one part of the parsing step
//   -- this would require converting plugins to operate on a line by line basis to avoid looping the whole thing.
// TODO: Add Parser for `Tags: ....`
// TODO: Add Parser for `Recurring: Weekly|Monthly`
// TODO: use type correctly
export function parseNote(text: string): Partial<any> {
  const note: any = {
    title: '',
    description: text,
    status: '',
    error: '',
    allDay: false,
  }

  if (!text) {
    return note
  }

  const textLines = text.split('\n')
  if (textLines.length == 0) {
    return note
  }

  const headerText = textLines[0]
  if (headerText === '') {
    return note
  }

  // quick and dirty way to check if the title text includes other information
  let isTask = false
  if (headerText.includes('ON ')) {
    const [title, dueString] = headerText.split('ON ')
    note.title = title

    if (ANYTIME_SYNONYMS.includes(dueString.toLowerCase().trim())) {
      note.due = null
      isTask = true
    } else {
      const [due, allDay] = parseDate(dueString, 'America/Los_Angeles') // TODO: pull timezone from user settings.
      if (due) {
        note.due = due.toISOString(true)
        note.allDay = allDay
        isTask = true
      } else {
        note.error += `Could not parse due date: ${dueString}`
      }
    }
  } else {
    note.title = headerText
  }

  for (const ignoredPrefix of IGNORED_TITLE_PREFIXES) {
    if (note.title.startsWith(ignoredPrefix)) {
      note.title = note.title.substring(ignoredPrefix.length)
    }
  }

  // Parse for metadata tags:
  for (let textLine of textLines) {
    textLine = textLine.trim()
    if (textLine === '') {
      continue
    }

    const lowerCaseTextContent = textLine.toLowerCase().trim()

    let isProperty = parseProperty(
      STATUS_PROPERTY.toString(),
      lowerCaseTextContent,
      note,
      (propertyText) =>
        STATUSES.includes(propertyText)
          ? ''
          : `${propertyText} is not a valid status (${STATUSES.join(',')}).`,
    )
    if (isProperty) {
      continue
    }

    isProperty = parseProperty(
      DUE_PROPERTY,
      lowerCaseTextContent,
      note,
      (propertyText) =>
        isDate(propertyText) ? '' : `${propertyText} is not a valid date.`,
    )
    if (isProperty) {
      note.due = moment
        .tz(note.due, 'America/Los_Angeles')
        .utc()
        .toISOString(true)
      continue
    }
  }

  // By default unless overridden anything with a due date should have the status todo.
  if (isTask && !note.status) {
    note.status = 'todo'
  }

  // Final trim of all whitespace
  if (note.description) {
    note.description = note.description.trim()
  }

  return note
}

// Returns true if the text contains the property (but not necessarily if it successfully parsed it since note.error is for that.)
function parseProperty(
  property: string,
  lowerCaseTextContent: string,
  note: any,
  validate: (value: string) => string,
): boolean {
  if (!lowerCaseTextContent.startsWith(`${property}:`)) {
    return false
  }

  // NOTE: This breaks the done button so lets allow multiple metadata properties to be set. The last one is the correct value.
  // If the property is already set that means multiple of the same properties were added to the same note
  // which is not allowed.
  // if ((note as any)[property]) {
  //   note.error += `${property} is already set.`
  //   return true
  // }

  // Check if the property text is in the acceptable format
  const propertyText = lowerCaseTextContent.replace(`${property}:`, '').trim()
  const error = validate(propertyText)
  if (error) {
    note.error += error
  }

  // Finally set the property
  ;(note as any)[property] = propertyText

  return true
}
