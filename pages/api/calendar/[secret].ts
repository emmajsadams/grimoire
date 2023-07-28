import type { NextApiRequest, NextApiResponse } from 'next'
import ical, { ICalEventBusyStatus } from 'ical-generator'
import moment from 'moment-timezone'
import { validate as validateUUID } from 'uuid'

import { TODO } from 'lib/notes/constants'
import prisma from 'lib/prisma'
import type { Note, User } from 'lib/prisma/client'

async function getUserWhere(where: any): Promise<User | null> {
  return (await prisma.user.findFirst({
    where,
  })) as any
}

async function getNotesWhere(where: any): Promise<Note[] | null> {
  return (await prisma.note.findMany({ where })) as any
}

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

    const today = moment.utc()
    const calendar = ical({
      name: 'Grimoire Notes Calendar',
      timezone: 'America/Los_Angeles',
      url: 'https://grimoireautomata.com',
    })
    for (const note of notes) {
      if (!note.due || !note.title) {
        continue
      }

      let noteDue = moment.utc(note.due)
      let title = note.title
      let allDay = note.allDay || false
      if (noteDue.isBefore(today)) {
        title = `OVERDUE: ${title}`
        allDay = true
        noteDue = today
      }
      const event: any = {
        id: note.id,
        start: moment.utc(note.due),
        allDay: note.allDay || false,
        summary: title,
        url: `https://grimoireautomata.com/notes/${note.id}`,
      }

      if (!allDay) {
        event.end = moment.utc(note.due).add(1, 'hours') // TODO: allow duration to be specified
        event.busystatus = ICalEventBusyStatus.BUSY // TODO: allow use to specify busy status?
      }

      // TODO: investigate more properties to set. `alarms` in particular seemed valuable but was ignored by all cliens.
      calendar.createEvent(event)
    }

    res.status(200).send(calendar.toString())
  } catch (err) {
    res.status(500).send((err as any).message)
  }
}
