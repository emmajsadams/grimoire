import { Note } from 'thin-backend'
import { TextNode } from 'lexical'
import moment from 'moment-timezone'
import * as chrono from 'chrono-node'
import { STATUS_PROPERTY, DUE_PROPERTY, STATUSES } from '../../notes'

// TODO: Move this to a helper function llibrary
// TODO: use user timezone
// EXPECTED FORMAT: "2013-11-18 11:55"
function isDate(date: string): boolean {
  return moment.tz(date, 'America/Los_Angeles').isValid()
}

// TODO: Add Parser for `Due: ....`
// TODO: Add Parser for `Tags: ....`
// TODO: Add Parser for `Recurring: Weekly|Monthly`
export function parseNote(textNodes: TextNode[]): Partial<Note> {
  const note: Partial<Note> = {
    title: '',
    description: '',
    status: '',
    error: '',
  }

  if (textNodes.length == 0) {
    return note
  }

  const headerText = textNodes[0].getTextContent().trim()
  if (headerText === '') {
    return note
  }

  // quick and dirty way to check if the title text includes other information
  let isTask = false
  if (headerText.includes('ON ')) {
    const [title, dueString] = headerText.split('ON ')
    note.title = title
    const due = chrono.parseDate(dueString)
    if (due) {
      let dueMoment = moment.tz(due, 'America/Los_Angeles')

      // if we dont include AT assume it is an all day event (which for now just means notify at 9am)
      if (!headerText.includes('AT ')) {
        dueMoment = dueMoment.hours(9).minutes(0).seconds(0).milliseconds(0)
      }

      note.due = dueMoment.utc().toISOString(true)
      isTask = true
    } else {
      note.error += `Could not parse due date: ${dueString}`
    }
  } else {
    note.title = headerText
  }

  // Parse for metadata tags:
  for (const textNode of textNodes) {
    const textContent = textNode.getTextContent()
    const lowerCaseTextContent = textContent.toLowerCase()

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
      console.log(note.due)
      continue
    }

    // By default unless overridden anything with a due date should have the status todo.
    if (isTask && !note.status) {
      note.status = 'todo'
    }

    note.description += textContent + ' \n '
  }

  return note
}

// Returns true if the text contains the property (but not necessarily if it successfully parsed it since note.error is for that.)
function parseProperty(
  property: string,
  lowerCaseTextContent: string,
  note: Partial<Note>,
  validate: (value: string) => string,
): boolean {
  if (!lowerCaseTextContent.startsWith(`${property}:`)) {
    return false
  }

  // If the property is already set that means multiple of the same properties were added to the same note
  // which is not allowed.
  if ((note as any)[property]) {
    note.error += `${property} is already set.`
    return true
  }

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
