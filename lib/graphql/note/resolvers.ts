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
    const query = parseSearchQuery(data.query) as any
    query.where.ownerId = ctx.user?.id

    return await ctx.prisma.note.findMany(query)
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
  async updateNote(
    @Arg('data') data: UpdateNoteInput,
    @Ctx() context: Context,
  ) {
    // Check if the user has access to the note.
    const note = await context.prisma.note.findFirst({
      where: {
        ownerId: context.user?.id,
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
    parsedNote.version = note.version + 1

    console.log(parsedNote)
    return await context.prisma.note.update({
      where: {
        id: note.id,
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
