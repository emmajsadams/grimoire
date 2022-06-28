// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ical from "ical-generator";

// type Data = {
//   name: string;
// };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const calendar = ical({ name: "my first iCal" });
  const startTime = new Date();
  const endTime = new Date();
  endTime.setHours(startTime.getHours() + 1);
  calendar.createEvent({
    start: startTime,
    end: endTime,
    summary: "Example Event",
    description: "It works ;)",
    location: "my room",
    url: "http://sebbo.net/",
  });

  res.status(200).send(calendar.toString());
}
