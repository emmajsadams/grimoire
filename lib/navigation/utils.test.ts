import { describe, expect, test } from '@jest/globals'
import { parseSearchQuery, createDefaultQuery } from 'lib/navigation/utils'

describe('parseSearchQuery', () => {
  test('blank query returns default query', () => {
    const expectedQuery = createDefaultQuery()
    expectedQuery.rawQuery = ''

    expect(parseSearchQuery(expectedQuery.rawQuery)).toEqual(expectedQuery)
  })
  test('defaults to title search if no part specified', () => {
    const expectedQuery = createDefaultQuery()
    expectedQuery.rawQuery = 'testtitle'
    expectedQuery.title = [
      {
        operation: '==',
        value: 'testtitle',
      },
    ]

    expect(parseSearchQuery(expectedQuery.rawQuery)).toEqual(expectedQuery)
  })
  // TODO: Parse title from query
  // test('should search title part', () => {
  //   const expectedQuery = createDefaultQuery()
  //   expectedQuery.rawQuery = 'title:testtitle'
  //   expectedQuery.title = [
  //     {
  //       operation: '==',
  //       value: 'testtitle',
  //     },
  //   ]

  //   expect(parseSearchQuery(expectedQuery.rawQuery)).toEqual(expectedQuery)
  // })
})
