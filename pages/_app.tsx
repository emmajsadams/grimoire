import '../styles/globals.css'
import Head from 'next/head'
import { Container } from '@mui/material'
import React, { useState, createContext } from 'react'
import { useRouter } from 'next/router'
import { ApolloProvider, useQuery, gql } from '@apollo/client'

import { client } from 'lib/graphql/client'
import { PrimaryAppBar } from 'lib/navigation/components'

const GET_AUTHORIZED_USER_WALLPAPER = gql`
  query GetAuthorizedUser {
    getAuthorizedUser {
      wallpaperUrl
    }
  }
`

export const QueryContext = createContext('')

export interface AppProps {}

export function LoginContainer({ children }: any): JSX.Element {
  // TODO: Convert this to an object that contains the parsed search components maybe?
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const { data, loading, error } = useQuery(GET_AUTHORIZED_USER_WALLPAPER)
  if (loading) return <>Loading user....</>
  if (error) return <>{`Loading user error! ${error.message}`}</>
  if (!data) {
    router.push('/login')
    return <>Redirecting to login no user</>
  }
  if (data) {
    document.body.style.background = `url("${
      data.wallpaperUrl || '/static/wallpapers/emma.jpg'
    }")`
  }

  return (
    <QueryContext.Provider value={searchQuery}>
      <PrimaryAppBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <Container maxWidth="lg">
        <>{children}</>
      </Container>
    </QueryContext.Provider>
  )
}

function MyApp({
  Component,
  pageProps,
}: {
  Component: any // TODO: More specific type
  pageProps: any // TODO: More specific type
}): JSX.Element {
  return (
    <ApolloProvider client={client}>
      <Head>
        <meta name="description" content="Grimoire Automata" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}

export default MyApp
