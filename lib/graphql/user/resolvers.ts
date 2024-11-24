import 'reflect-metadata'
import { Resolver, Query, Ctx, Mutation, Arg, Authorized } from 'type-graphql'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

import { User, UserLoginInput } from './model'
import type { Context } from '../context'

@Resolver(User)
export class UserResolver {
  @Mutation(() => String)
  async loginUser(
    @Arg('data') data: UserLoginInput,
    @Ctx() ctx: Context,
  ): Promise<string> {
    const user = await ctx.prisma.user.findUnique({
      where: { email: data.email },
    })
    if (!user) {
      throw new Error('No such user found')
    }

    const valid = await bcrypt.compare(data.password, user.password)
    if (!valid) {
      throw new Error('Invalid password')
    }

    const secret = process.env.SECRET as any // TODO: fix this typing
    const token = jwt.sign({ userId: user.id }, secret)

    return token
  }

  @Authorized()
  @Query(() => User)
  async getAuthorizedUser(@Ctx() ctx: Context) {
    if (!ctx.user) {
      throw new Error('No authorized user')
    }

    return ctx.user
  }

  @Authorized()
  @Mutation(() => String)
  async regenerateCalendarApiKey(@Ctx() ctx: Context) {
    if (!ctx.user) {
      throw new Error('No authorized user')
    }

    return await ctx.prisma.user.update({
      where: {
        id: ctx.user.id,
      },
      data: {
        calendarApiKey: uuidv4(),
      },
    })
  }
}
