// TODO move get and update to this file

import prisma from 'lib/prisma'
import { Note } from 'lib/prisma/client'

export async function createNote(note: Note): Promise<Note | null> {
  return await prisma.note.create({ data: note })
}
