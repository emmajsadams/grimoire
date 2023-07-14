import 'reflect-metadata'
import { Resolver, Query, Ctx } from 'type-graphql'
import { User } from 'lib/graphql/user/model'
import type { Context } from 'lib/graphql/context'

@Resolver(User)
export class UserResolver {
  @Query(() => [User])
  async allUsers(@Ctx() ctx: Context) {
    return ctx.prisma.account.findMany()
  }
}
