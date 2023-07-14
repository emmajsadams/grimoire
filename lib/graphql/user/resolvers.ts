import 'reflect-metadata'
import { Resolver, Query, Ctx } from 'type-graphql'
import { User } from './model'
import type { Context } from '../context'

@Resolver(User)
export class UserResolver {
  @Query(() => [User])
  async allUsers(@Ctx() ctx: Context) {
    return ctx.prisma.account.findMany()
  }
}
