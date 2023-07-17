import { PrismaClient, User } from 'lib/prisma/client'

const prisma = new PrismaClient()

export interface Context {
  prisma: PrismaClient
  user: User | null
}

export const context: Context = {
  prisma: prisma,
  user: null,
}
