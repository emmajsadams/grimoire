import type { NextApiRequest, NextApiResponse } from 'next'
import { AuthOptions } from 'pages/api/auth/[...nextauth]'
import { unstable_getServerSession } from 'next-auth/next'
import { Session } from 'next-auth'

import { User } from 'lib/prisma/client'
import { getUserByEmail } from 'lib/users/server'

interface SessionUser {
  session: Session | null
  user: User | null
}

interface OwnedResource {
  ownerId: string
}

// Getters

export async function getApiSession(
  req: NextApiRequest,
  res: NextApiResponse<string>,
): Promise<Session | null> {
  return await unstable_getServerSession(req, res, AuthOptions)
}

export async function getApiUser(
  req: NextApiRequest,
  res: NextApiResponse<string>,
): Promise<SessionUser> {
  const session = await getApiSession(req, res)
  const user = await getUserByEmail(session?.user?.email || '')

  if (!user) {
    res.status(401).json(JSON.stringify({ message: 'You must be logged in.' }))
    return { session, user: null }
  }

  return { session, user }
}

export async function getContextSession(context: any): Promise<Session | null> {
  return await unstable_getServerSession(context.req, context.res, AuthOptions)
}

export async function getContextUser(context: any): Promise<SessionUser> {
  const session = await getContextSession(context)
  const user = await getUserByEmail(session?.user?.email || '')

  return { session, user }
}

// Validators

export async function validateUserHasAccessToResource(
  req: NextApiRequest,
  res: NextApiResponse<string>,
  ownedResource: OwnedResource,
): Promise<SessionUser> {
  const { session, user } = await getApiUser(req, res)
  if (!user) {
    return { session, user }
  }

  if (user.id !== ownedResource.ownerId) {
    res.status(401).json(JSON.stringify({ message: 'You do not have access.' }))
    return { session, user }
  }

  return { session, user }
}
