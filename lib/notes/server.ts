// TODO move get and update to this file

import type { Note } from from '@prisma/client'

import prisma from 'lib/prisma'

export async function createNote(note: Note): Promise<Note | null> {
  return await prisma.note.create({ data: note })
}

export async function getNotesWhere(where: any): Promise<Note[] | null> {
  return await prisma.note.findMany({ where })
}
