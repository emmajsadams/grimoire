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
}

const authHandler: NextApiHandler = (req, res) =>
  NextAuth(req, res, AuthOptions)

export default authHandler
