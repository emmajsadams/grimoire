import * as chrono from 'chrono-node'
import en from 'javascript-time-ago/locale/en'
import moment from 'moment-timezone'
import TimeAgo from 'javascript-time-ago'

TimeAgo.addDefaultLocale(en)

export const DEFAULT_TIMEZONE = 'America/Los_Angeles'
export const DEFAULT_LOCALE = 'en-US'

export function formatTimeAgo(date: string): string {
  if (!date) {
    return ''
  }

  // TODO: Consider using a user.locale property then falling back to en-US
  const timeAgo = new TimeAgo(DEFAULT_LOCALE)

  return timeAgo.format(new Date(date)) as any
}

// EXPECTED FORMAT: "2013-11-18 11:55"
export function isDate(date: string): boolean {
  // TODO: Consider using a user.timezone property then falling back to LA
  return moment.tz(date, DEFAULT_TIMEZONE).isValid()
}

export function parseDate(
  dateString: string,
  timezone: string,
): [date: moment.Moment | null, allDay: boolean] {
  const date = chrono.parseDate(dateString)
  if (!date) {
    return [null, false]
  }

  let dateMoment = moment.tz(date, timezone)
  let allDay = false

  // if we dont include AT assume it is an all day event (which for now just means notify at 9am)
  if (!dateString.includes('AT ')) {
    dateMoment = dateMoment.hours(9).minutes(0).seconds(0).milliseconds(0)
    allDay = true
  }

  return [dateMoment.utc(), allDay]
}
