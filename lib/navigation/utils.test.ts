import { describe, expect, test } from '@jest/globals'
import { parseSearchQuery } from 'lib/navigation/utils'

describe('parseSearchQuery', () => {
  test('blank query returns default query', () => {
    expect(parseSearchQuery('')).toEqual({
      where: {
        title: {
          contains: '',
          mode: 'insensitive',
        },
        status: 'todo',
      },
      orderBy: [
        {
          due: 'asc',
        },
        {
          createdAt: 'asc',
        },
      ],
    })
  })
})
