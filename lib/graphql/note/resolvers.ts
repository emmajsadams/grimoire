import 'reflect-metadata'
import { Resolver, Query, Ctx, Arg, Mutation } from 'type-graphql'
import { Note, NoteSearchInput, NoteIdInput, UpdateNoteInput } from './model'
import type { Context } from '../context'
import { parseNote } from '../../notes/utils'

@Resolver(Note)
export class NoteResolver {
  // TODO: Use @Authorized
  @Query(() => [Note])
  async getNotes(@Arg('data') data: NoteSearchInput, @Ctx() ctx: Context) {
    if (!ctx.user) {
      return []
    }

    return await ctx.prisma.note.findMany({
      where: {
        ownerId: ctx.user.id,
        title: {
          contains: data.title,
          mode: 'insensitive',
        },
        status: data.status,
      },
      orderBy: [
        {
          due: 'asc',
        },
        {
          createdAt: 'asc',
        },
      ],
    })
  }

  @Query(() => Note)
  async getNote(@Arg('data') data: NoteIdInput, @Ctx() ctx: Context) {
    if (!ctx.user) {
      return null
    }

    return await ctx.prisma.note.findFirst({
      where: {
        ownerId: ctx.user.id,
        id: data.id,
      },
    })
  }

  @Mutation(() => Note)
  async updateNote(@Arg('data') data: UpdateNoteInput, @Ctx() ctx: Context) {
    if (!ctx.user) {
      return null
    }

    // Check if the user has access to the note.
    const note = await ctx.prisma.note.findFirst({
      where: {
        ownerId: ctx.user.id,
        id: data.id,
      },
    })
    if (!note) {
      return null
    }

    const parsedNote = parseNote(data.note)
    if (parsedNote.error) {
      return null
    }
    delete parsedNote.error
    parsedNote.version = (note.version || 0) + 1

    const updatedNote = await ctx.prisma.note.update({
      where: {
        id: data.id,
      },
      data: parsedNote,
    })
    console.log(updatedNote)
    return updatedNote
  }
}
