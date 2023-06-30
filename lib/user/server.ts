import prisma from 'lib/prisma'
import { User } from 'lib/prisma/client'

export async function getUserWhere(where: any): Promise<User | null> {
  return await prisma.user.findFirst({
    where,
  })
}

export async function getUser(id: string): Promise<User | null> {
  return await prisma.user.findFirst({
    where: {
      id: id,
    },
  })
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return await prisma.user.findFirst({
    where: {
      email: email,
    },
  })
}

export async function updateUser(user: User): Promise<User | null> {
  return await prisma.user.update({
    where: {
      id: user.id,
    },
    data: user,
  })
}
