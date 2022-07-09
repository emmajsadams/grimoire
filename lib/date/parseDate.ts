import moment from 'moment-timezone'
import * as chrono from 'chrono-node'

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
