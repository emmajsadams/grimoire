// TODO: Figure out why I have to use a relative import here
import { isDate } from '../../../lib/datetime'

test('isDate: returns true for date matching expected format', () => {
  expect(isDate('2013-11-18 11:55')).toEqual(true)
})

test('isDate: returns false for date not matching expected format', () => {
  expect(isDate('NOT A DATE')).toEqual(false)
})
