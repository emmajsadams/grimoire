import '../styles/globals.css'
import Head from 'next/head'
import { Container } from '@mui/material'
import React, { useState } from 'react'
import { SessionProvider } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import { PrimaryAppBar } from 'lib/navigation/components'
import { Query } from 'lib/navigation/constants'
import { parseSearchQuery } from 'lib/navigation/utils'
import { getCurrentUser } from 'lib/users/client'

export interface AppProps {
  searchQuery: Query
  setSearchQuery: (query: Query) => void
}

function LoginContainer({ children }: any): JSX.Element {
  const router = useRouter()
  const { status } = useSession()

  if (status === 'loading') {
    return <>Loading</>
  }

  if (status === 'unauthenticated') {
    router.push('/api/auth/signin')
  }

  return children
}

function BackgroundImageContainer({ children }: any): JSX.Element {
  const { data, component } = getCurrentUser()
  if (!data || component) {
    return component
  }

  document.body.style.background = `url("${
    data.wallpaperUrl || '/static/wallpapers/emma.jpg'
  }")`
  return (
    <Container maxWidth="lg">
      <>{children}</>
    </Container>
  )
}

function MyApp({
  Component,
  pageProps,
}: {
  Component: any // TODO: More specific type
  pageProps: any // TODO: More specific type
}): JSX.Element {
  // TODO: Convert this to an object that contains the parsed search components maybe?
  const [searchQuery, setSearchQuery] = useState(
    parseSearchQuery('status:==:todo'), //
  )

  // TODO: Can I remove this and stop passing customProps to Component?
  const customProps: AppProps = {
    searchQuery,
    setSearchQuery,
    ...pageProps,
  }

  return (
    <SessionProvider session={pageProps.session}>
      <LoginContainer>
        <Head>
          <meta name="description" content="Grimoire Automata" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <PrimaryAppBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <BackgroundImageContainer>
          <Component {...customProps} />
        </BackgroundImageContainer>
      </LoginContainer>
    </SessionProvider>
  )
}

export default MyApp
