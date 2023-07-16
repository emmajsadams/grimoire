import 'reflect-metadata'

import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { GraphQLScalarType } from 'graphql'
import { DateTimeResolver } from 'graphql-scalars'
import * as tq from 'type-graphql'
import { Context, context } from './context'
import { UserResolver } from './user/resolvers'
import { NoteResolver } from './note/resolvers'
import jwt from 'jsonwebtoken'

// TODOOOO USE  EXPRESS JWT!!!
const app = async () => {
  const schema = await tq.buildSchema({
    resolvers: [UserResolver, NoteResolver],
    scalarsMap: [{ type: GraphQLScalarType, scalar: DateTimeResolver }],
    validate: { forbidUnknownValues: false },
  })

  const server = new ApolloServer<Context>({ schema })

  const { url } = await startStandaloneServer(server, {
    context: async ({ req, res }) => {
      const authorization = req.headers.authorization
      if (authorization) {
        // Use splicing instead
        const token = authorization.replaceAll('Bearer ', '')
        const decoded = jwt.verify(token, process.env.SECRET)
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
