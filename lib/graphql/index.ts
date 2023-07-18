import 'reflect-metadata'

import { ApolloServer } from '@apollo/server'
import { DateTimeResolver } from 'graphql-scalars'
import { GraphQLScalarType } from 'graphql'
import { startStandaloneServer } from '@apollo/server/standalone'
import * as tq from 'type-graphql'
import jwt from 'jsonwebtoken'

import { Context, context } from 'lib/graphql/context'
import { NoteResolver } from 'lib/graphql/note/resolvers'
import { UserResolver } from 'lib/graphql/user/resolvers'

const app = async () => {
  const schema = await tq.buildSchema({
    resolvers: [UserResolver, NoteResolver],
    scalarsMap: [{ type: GraphQLScalarType, scalar: DateTimeResolver }],
    validate: { forbidUnknownValues: false },
    authChecker: ({ context }, _) => {
      if (context.user) {
        return true
      }

      return false
    },
  })

  const server = new ApolloServer<Context>({ schema })

  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
      const authorization = req.headers.authorization
      if (authorization && process.env.SECRET) {
        // Use splicing instead
        const token = authorization.replaceAll('Bearer ', '')
        const decoded = jwt.verify(token, process.env.SECRET) as any
        const user = await context.prisma.user.findUnique({
          where: { id: decoded.userId },
        })
        if (!user) {
          throw new Error('No such user found')
        }
        context.user = user
      }

      return context
    },
  })

  console.log(`
🚀 Server ready at: ${url}
⭐️  See sample queries: http://pris.ly/e/ts/graphql-typegraphql#using-the-graphql-api`)
}

app()
