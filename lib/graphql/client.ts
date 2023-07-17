import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
})

const authLink = setContext((_, { headers }) => {
  const componentType = typeof window === 'undefined' ? 'server' : 'client'
  if (componentType === 'server') {
    return {
      headers: {
        ...headers,
      },
    }
  }

  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token')
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
