import 'reflect-metadata'

import { Resolver, Query, Ctx, Arg, Mutation, Authorized } from 'type-graphql'
import {
  Note,
  NoteSearchInput,
  NoteIdInput,
  UpdateNoteInput,
  CreateNoteInput,
} from 'lib/graphql/note/model'
import type { Context } from 'lib/graphql/context'
import { parseNote } from 'lib/notes/utils'
import { parseSearchQuery } from 'lib/navigation/utils'

@Resolver(Note)
export class NoteResolver {
  @Authorized()
  @Query(() => [Note])
  async getNotes(@Arg('data') data: NoteSearchInput, @Ctx() ctx: Context) {
    const query = parseSearchQuery(data.query)

    let title = ''
    if (query.title.length) {
      title = query.title[0].value
    }
    // TODO: Finish supporting rest of query object
    return await ctx.prisma.note.findMany({
      where: {
        ownerId: ctx.user?.id,
        title: {
          contains: title,
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

  @Authorized()
  @Query(() => Note)
  async getNote(@Arg('data') data: NoteIdInput, @Ctx() context: Context) {
    return await context.prisma.note.findFirst({
      where: {
        ownerId: context.user?.id,
        id: data.id,
      },
    })
  }

  @Authorized()
  @Mutation(() => Note)
  async updateNote(@Arg('data') data: UpdateNoteInput, @Ctx() ctx: Context) {
    // Check if the user has access to the note.
    const note = await ctx.prisma.note.findFirst({
      where: {
        ownerId: ctx.user?.id,
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

  @Authorized()
  @Mutation(() => Note)
  async createNote(@Arg('data') data: CreateNoteInput, @Ctx() ctx: Context) {
    const parsedNote = parseNote(data.note)
    if (parsedNote.error) {
      return null
    }
    delete parsedNote.error
    parsedNote.version = 1
    parsedNote.ownerId = ctx.user?.id

    return await ctx.prisma.note.create({ data: parsedNote as any })
  }
}
