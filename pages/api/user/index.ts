import type { NextApiRequest, NextApiResponse } from 'next'

import { getApiUser } from 'lib/auth/server'
import { updateUser } from 'lib/user/server'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>,
) {
  // Validate the user is logged in and get their user object
  const { user } = await getApiUser(req, res)
  if (!user) {
    return
  }

  if (req.method === 'GET') {
    let updatedUser = false
    if (req.query.wallpaper) {
      user.wallpaperUrl = req.query.wallpaper as string
      updatedUser = true
    }

    if (req.query.calendarApiKey) {
      user.calendarApiKey = req.query.calendarApiKey as string
      updatedUser = true
    }

    if (updatedUser) {
      return res.status(200).json((await updateUser(user)) as any)
    }

    return res.status(200).json(user as any)
  } else if (req.method === 'PUT') {
    return res.status(200).json(user as any)
  } else {
    res.status(405).end()
  }
}
