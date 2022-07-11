import type { NextApiRequest, NextApiResponse } from 'next'
import ical, { ICalEventBusyStatus } from 'ical-generator'
import { DONE, DELETED } from '../../../lib/notes'
import postgres from 'postgres'
import moment from 'moment-timezone'
import { validate as validateUUID } from 'uuid'

const sql = postgres(process.env.THIN_DB_URL || '', {})

// TODO: ratelimit failed attempts to prevent brute force attacks
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>,
) {
  try {
    const { secret } = req.query

    if (!secret || typeof secret !== 'string') {
      res.status(400).send('Missing secret')
      return
    }

    if (!validateUUID(secret)) {
      res.status(400).send('Invalid secret')
      return
    }

    const users = await sql`
      select
        id,
        timezone
      from users
      where calendar_secret = ${secret}
    `
    if (!users || users.length !== 1) {
      res.status(400).send('Invalid secret')
      return
    }
    const user = users[0]

    const notes = await sql`
      select
        id,
        title,
        due,
        status,
        all_day
      from notes
      where user_id = ${user.id}
        AND status != ${DELETED}
        AND status != ${DONE}
        AND due IS NOT NULL
        AND title != ''
    `

    const calendar = ical({
      name: 'Grimoire Notes Calendar',
      timezone: 'America/Los_Angeles',
      url: 'https://grimoireautomata.com',
    })
    for (const note of notes) {
      if (!note.due || !note.title) {
        continue
      }

      // TODO: investigate more properties to set. `alarms` in particular seemed valuable but was ignored by all cliens.
      calendar.createEvent({
        id: note.id,
        start: moment.utc(note.due),
        end: moment.utc(note.due).add(1, 'hours'), // TODO: allow duration to be specified
        allDay: note.all_day,
        summary: note.title,
        busystatus: ICalEventBusyStatus.BUSY, // TODO: allow use to specify busy status?
        url: `https://grimoireautomata.com/notes/${note.id}`,
      })
    }

    res.status(200).send(calendar.toString())
  } catch (err) {
    res.status(500).send((err as any).message)
  }
}
