import type { NextApiRequest, NextApiResponse } from 'next'

import { getApiUser } from 'lib/auth/server'
import { updateUser } from 'lib/user/server'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>,
) {
  // Only allow POST requests
  if (req.method !== 'GET') {
    res.status(405).end()
    return
  }

  // Validate the user is logged in and get their user object
  const { user } = await getApiUser(req, res)
  if (!user) {
    return
  }

  // TODO: add actual wallpaper url updating, this is just a quick hack to test
  if (req.query.wallpaper) {
    user.wallpaperUrl = req.query.wallpaper as string
    return res.status(200).json((await updateUser(user)) as any)
  }

  return res.status(200).json(user as any)
}
