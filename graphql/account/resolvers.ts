import 'reflect-metadata'
import { Resolver, Query, Ctx } from 'type-graphql'
import { Account } from './model'
import type { Context } from '../context'

@Resolver(Account)
export class AccountResolver {
  @Query(() => [Account])
  async allUsers(@Ctx() ctx: Context) {
    return ctx.prisma.account.findMany()
  }
}
