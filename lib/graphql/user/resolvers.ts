import 'reflect-metadata'
import { Resolver, Query, Ctx, Mutation, Arg } from 'type-graphql'
import { User, UserLoginInput } from './model'
import type { Context } from '../context'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

@Resolver(User)
export class UserResolver {
  @Query(() => User)
  async getAuthorizedUser(@Ctx() ctx: Context) {
    return ctx.user
  }

  @Mutation((returns) => String)
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

    const token = jwt.sign({ userId: user.id }, process.env.SECRET)

    return token
  }
}
