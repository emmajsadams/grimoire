import type { NextApiRequest, NextApiResponse } from 'next'

import { validateUserHasAccessToResource } from 'lib/auth/server'
import prisma from 'lib/prisma'
import { Note } from 'lib/prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>,
) {
  if (req.method == 'PUT') {
    const updatedNote = await updateNote(JSON.parse(req.body) as Note)

    res.status(200).json(updatedNote as any)
  } else if (req.method == 'GET') {
    const note = await getNote(req.query.id as string)
    if (!note) {
      res.status(404).end()
      return
    }

    const { user } = await validateUserHasAccessToResource(
      req,
      res,
      note as any,
    )
    if (!user) {
      return res.status(403).end()
    }

    return res.status(200).json(note as any)
  } else {
    res.status(405).end()
  }
}

const updateNote = async (note: Note): Promise<Note> => {
  return await prisma.note.update({
    where: {
      id: note.id,
    },
    data: note,
  })
}

const getNote = async (id: string): Promise<Note | null> => {
  return await prisma.note.findFirst({
    where: {
      id: id,
    },
  })
}
