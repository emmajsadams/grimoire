import moment from 'moment-timezone'

// TODO: Move this to a helper function llibrary
// TODO: use user timezone
// EXPECTED FORMAT: "2013-11-18 11:55"
export function isDate(date: string): boolean {
  return moment.tz(date, 'America/Los_Angeles').isValid()
}
