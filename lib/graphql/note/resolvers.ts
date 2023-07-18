import 'reflect-metadata'

import { Resolver, Query, Ctx, Arg, Mutation } from 'type-graphql'
import {
  Note,
  NoteSearchInput,
  NoteIdInput,
  UpdateNoteInput,
  CreateNoteInput,
} from 'lib/graphql/note/model'
import type { Context } from 'lib/graphql/context'
import { parseNote } from 'lib/notes/utils'
import { parseQuery } from 'lib/navigation/utils'

@Resolver(Note)
export class NoteResolver {
  // TODO: Use @Authorized
  @Query(() => [Note])
  async getNotes(@Arg('data') data: NoteSearchInput, @Ctx() ctx: Context) {
    if (!ctx.user) {
      return []
    }

    // TODO: Change this to use parseQuery
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

    return await ctx.prisma.note.update({
      where: {
        id: data.id,
      },
      data: parsedNote,
    })
  }

  @Mutation(() => Note)
  async createNote(@Arg('data') data: CreateNoteInput, @Ctx() ctx: Context) {
    if (!ctx.user) {
      return null
    }

    const parsedNote = parseNote(data.note)
    if (parsedNote.error) {
      return null
    }
    delete parsedNote.error
    parsedNote.version = 1
    parsedNote.ownerId = ctx.user.id

    return await ctx.prisma.note.create({ data: parsedNote as any })
  }
}
