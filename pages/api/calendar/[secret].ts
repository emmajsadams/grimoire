import type { NextApiRequest, NextApiResponse } from 'next'
import ical, { ICalEventBusyStatus } from 'ical-generator'
import moment from 'moment-timezone'
import { validate as validateUUID } from 'uuid'

import { TODO } from 'lib/notes'
import { getUserWhere } from 'lib/user/server'
import { getNotesWhere } from 'lib/notes/server'

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

    const user = await getUserWhere({ calendarApiKey: secret })
    if (!user) {
      res.status(400).send('Invalid secret')
      return
    }

    // TODO: add is not null for due somehow... for loop handles it below
    const notes = await getNotesWhere({
      ownerId: user.id,
      status: TODO,
    })
    if (!notes) {
      res.status(500).send('Valid secret, but critical error loading notes.')
      return
    }

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
        allDay: note.allDay || false,
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
