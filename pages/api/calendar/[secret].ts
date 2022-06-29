// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ical from "ical-generator";
import { DONE } from "../../../lib/models/notes/parseNote";
import postgres from "postgres";

const sql = postgres(process.env.THIN_DB_URL || "", {});

// TODO: basically need to create a separate public entities
// TODO: Set an api key for accessing this endpoint
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  try {
    // console.log("test");
    // initThinBackend({ host: process.env.NEXT_PUBLIC_BACKEND_URL });

    const { secret } = req.query;

    // if (!secret || typeof secret !== "string") {
    //   res.status(400).send("Missing secret");
    //   return;
    // }

    // // TODO: For now secret is just user id, but it should be something separate and resettable.
    // let publicNotes = await query("public_notes")
    //   .where("userId", secret)
    //   .fetch();
    // console.log(publicNotes);

    console.log(secret);
    const notes = await sql`
      select
        id,
        title,
        due,
        status
      from notes
      where user_id = ${secret}
    `;

    const calendar = ical({ name: "Grimoire Notes Calendar" });
    for (const note of notes) {
      console.log(note);
      if (!note.due || !note.title || note.status == DONE) {
        continue;
      }

      const startTime = new Date(note.due);
      const endTime = new Date(note.due);
      endTime.setHours(startTime.getHours() + 1); // TODO: ask user to specify duration?

      calendar.createEvent({
        start: startTime,
        end: endTime,
        summary: note.title,
        // description: "It works ;)", TODO: ask user to specify description?
        // location: "my room", TODO: ask user to specify location?
        url: `https://grimoireautomata.com/notes/${note.id}`,
      });
    }
    res.status(200).send(calendar.toString());
  } catch (err) {
    res.status(500).send(err.message);
  }
}
