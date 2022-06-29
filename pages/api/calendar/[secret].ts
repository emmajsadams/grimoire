// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ical, { ICalAlarmType, ICalEventBusyStatus } from "ical-generator";
import { DONE } from "../../../lib/models/notes/parseNote";
import postgres from "postgres";
import moment from "moment-timezone";
import { v4 as uuidv4 } from "uuid";

const sql = postgres(process.env.THIN_DB_URL || "", {});

// TODO: basically need to create a separate public entities
// TODO: Set an api key for accessing this endpoint
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  try {
    const { secret } = req.query;

    // TODO: Validate that secret is a uuid and bail early if not
    // TODO: ratelimit failed attempts to prevent brute force attacks
    if (!secret || typeof secret !== "string") {
      res.status(400).send("Missing secret");
      return;
    }

    const users = await sql`
      select
        id,
        timezone
      from users
      where calendar_secret = ${secret}
    `;
    if (!users || users.length !== 1) {
      res.status(400).send("Invalid secret");
      return;
    }
    const user = users[0];

    const notes = await sql`
      select
        id,
        title,
        due,
        status
      from notes
      where user_id = ${user.id}
    `;

    const calendar = ical({
      name: "Grimoire Notes Calendar",
      timezone: "America/Los_Angeles",
      url: "https://grimoireautomata.com",
    });
    for (const note of notes) {
      if (!note.due || !note.title || note.status == DONE) {
        continue;
      }

      const startTime = moment.utc(note.due);
      const endTime = moment.utc(note.due).add(1, "hours");

      // TODO: investigate more properties to set
      calendar.createEvent({
        id: note.id,
        start: startTime,
        end: endTime,
        summary: note.title,
        busystatus: ICalEventBusyStatus.BUSY,
        alarms: [
          {
            type: ICalAlarmType.display,
            triggerBefore: 3600, // 1 hour
            // TODO: I might need this and a UID for the alarm but the library does not support it
            // So I can just add a new property for it and do a replaceAll
            x: [
              {
                key: "X-WR-ALARMUID",
                value: uuidv4(),
              },
              {
                key: "X-ALARMUIDTOBEREPLACED",
                value: uuidv4(),
              },
            ],
          },
          {
            type: ICalAlarmType.audio,
            triggerBefore: 3600, // 1 hour
            x: [
              {
                key: "X-WR-ALARMUID",
                value: uuidv4(),
              },
              {
                key: "X-ALARMUIDTOBEREPLACED",
                value: uuidv4(),
              },
            ],
          },
        ],
        // description: "It works ;)", TODO: ask user to specify description?
        // location: "my room", TODO: ask user to specify location?
        url: `https://grimoireautomata.com/notes/${note.id}`,
      });
    }

    // TODO: Figure out what `ATTACH;VALUE=URI:Basso` is in the output from this?
    res
      .status(200)
      .send(calendar.toString().replaceAll("X-ALARMUIDTOBEREPLACED", "UID"));
  } catch (err) {
    res.status(500).send((err as any).message);
  }
}
