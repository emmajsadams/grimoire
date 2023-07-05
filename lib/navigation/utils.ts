import moment from 'moment-timezone'
import {
  TITLE_PROPERTY,
  DUE_PROPERTY,
  STATUS_PROPERTY,
  TAG_PROPERTY,
  TAGS,
  STATUSES,
} from 'lib/notes/constants'
import { Query, Operations } from 'lib/navigation/constants'

export function createDefaultQuery(): Query {
  return {
    [TITLE_PROPERTY]: [
      {
        operation: '==',
        value: '',
      },
    ],
    [DUE_PROPERTY]: [],
    [STATUS_PROPERTY]: [],
    [TAG_PROPERTY]: [],
    errors: [],
    rawQuery: '',
  }
}

// TODO: Add a query language in the search bar
// Commands should be wrapped in ``` character. EX: ```due:asc&&```
// Should support || (OR) or && (AND). OrderBy commands should only support && (AND)
// It should support commands like `due:exists`, `due:>2019-06-05` (including <, >=, <=, =, !=), `due:asc` (or desc)
// By default `due:asc&&status:!=done&&` should be set to get a filtered view.
//
// TODO: parse this in appBar when setting state instead
export function parseSearchQuery(searchQuery: string): Query {
  const stringQueryParts = searchQuery.trim().split(' ')
  const queryParts = createDefaultQuery()
  queryParts.rawQuery = searchQuery

  for (const stringQueryPart of stringQueryParts) {
    // TODO: Parse title from query
    // const parsedTitle = parseQueryPart(
    //   queryParts,
    //   stringQueryPart,
    //   TITLE_PROPERTY,
    //   null,
    //   (value) => value,
    // )
    // if (parsedTitle) {
    //   continue
    // }

    const parsedTag = parseQueryPart(
      queryParts,
      stringQueryPart,
      TAG_PROPERTY,
      TAGS,
      (value) => value,
    )
    if (parsedTag) {
      continue
    }

    const parsedDue = parseQueryPart(
      queryParts,
      stringQueryPart,
      DUE_PROPERTY,
      null,
      (value) => moment.tz(value, 'America/Los_Angeles').utc(),
    )
    if (parsedDue) {
      continue
    }

    const parsedStatus = parseQueryPart(
      queryParts,
      stringQueryPart,
      STATUS_PROPERTY,
      STATUSES,
      (value) => value,
    )
    if (parsedStatus) {
      continue
    }

    // if could not parse it as a query part than it is part of title
    queryParts[TITLE_PROPERTY][0].value += (stringQueryPart + ' ').trim()
  }

  return queryParts
}

// Returns true if the query part contained the property (errors and results will be set on query directly)
function parseQueryPart(
  query: Query,
  stringQueryPart: string,
  property: string,
  expectedValues: string[] | null,
  parse: (stringQueryPart: string) => any,
): boolean {
  if (!stringQueryPart.startsWith(`${property}:`)) {
    return false
  }

  const [, operation, rawValue] = stringQueryPart.split(':')

  if (!Operations.includes(operation)) {
    query.errors.push(`Unknown operation: ${operation}`)
    return true
  }

  if (!rawValue) {
    query.errors.push(
      `Value not defined ${
        expectedValues ? `(${expectedValues.join(', ')})` : ''
      }`,
    )
    return true
  }

  const value = parse(rawValue.trim())
  if (expectedValues && !expectedValues.includes(value)) {
    query.errors.push(
      `Value is not allowed (${expectedValues.join(', ')}): ${rawValue}`,
    )
    return true
  }

  ;(query as any)[property].push({
    operation: operation.trim(),
    value: value,
  })

  return true
}

// TODO: Type this correctly
export function setQueryFilters(
  queryBuilder: any,
  searchQueryPart: any,
  property: any,
): any {
  if (searchQueryPart.operation === '==') {
    return queryBuilder.where(property, searchQueryPart.value)
  } else if (searchQueryPart.operation === '!=') {
    return queryBuilder.whereNot(property, searchQueryPart.value)
  }

  return queryBuilder
}
