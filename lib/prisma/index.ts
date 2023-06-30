import { PrismaClient } from 'lib/prisma/client'

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  const globalAny: any = global
  if (!globalAny.prisma) {
    globalAny.prisma = new PrismaClient({})
  }
  prisma = globalAny.prisma
}

export default prisma
