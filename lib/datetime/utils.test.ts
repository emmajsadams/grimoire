import { describe, expect, test } from '@jest/globals'

import {
  formatTimeAgo,
  isDate,
  parseDate,
  DEFAULT_TIMEZONE,
} from 'lib/datetime/utils'

describe('formatTimeAgo', () => {
  test('returns nothing if empty string', () => {
    expect(formatTimeAgo('')).toEqual('')
  })

  test('returns us localized date', () => {
    const now = new Date()
    now.setSeconds(now.getSeconds() + 1)

    expect(formatTimeAgo(now.toISOString())).toEqual('in a moment')
  })
})

describe('isDate', () => {
  test('returns true for date matching expected format', () => {
    expect(isDate('2013-11-18 11:55')).toEqual(true)
  })

  test('returns false for date not matching expected format', () => {
    expect(isDate('NOT A DATE')).toEqual(false)
  })
})

test('parseDate: returns null and false if not a date', () => {
  expect(parseDate('not a date', DEFAULT_TIMEZONE)).toEqual([null, false])
})

test('parseDate: returns all day date for next month', () => {
  const [date, allDay] = parseDate('in one month', DEFAULT_TIMEZONE)

  const now = new Date()
  now.setMonth(now.getMonth() + 1)
  expect(date?.month()).toEqual(now.getMonth())
  expect(allDay).toEqual(true)
})

test('parseDate: returns date at specific time for next month', () => {
  const [date, allDay] = parseDate('in one month AT 5am', DEFAULT_TIMEZONE)

  const now = new Date()
  now.setMonth(now.getMonth() + 1)
  expect(date?.month()).toEqual(now.getMonth())
  expect(date?.hours()).toEqual(12)
  expect(allDay).toEqual(false)
})
