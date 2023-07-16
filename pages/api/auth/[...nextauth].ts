import { NextApiHandler } from 'next'
import NextAuth from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GitHubProvider from 'next-auth/providers/github'

import prisma from 'lib/prisma'

export const AuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
  ],
  adapter: PrismaAdapter(prisma as any), // TODO: fix typing
  secret: process.env.SECRET,
  async session({
    session,
    token,
    user,
  }: {
    session: any
    token: any
    user: any
  }) {
    const getToken = await prisma.account.findFirst({
      where: {
        userId: user.id,
      },
    })
    console.log(getToken)

    let accessToken: string | null = null
    if (getToken) {
      accessToken = getToken.access_token!
    }

    session.user.token = accessToken
    return session
  },
}

const authHandler: NextApiHandler = (req, res) =>
  NextAuth(req, res, AuthOptions)

export default authHandler
