import '../styles/globals.css'
import Head from 'next/head'
import { Container } from '@mui/material'
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { SessionProvider } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import { useRouter } from 'next/router'

import { User } from 'lib/prisma/client'
import { PrimaryAppBar } from 'lib/navigation'
import { Query, parseSearchQuery } from 'lib/search'
import { fetcher } from 'lib/swr'

export interface AppProps {
  clientId: string
  searchQuery: Query
  setSearchQuery: (query: Query) => void
}

// TODO: redirect unauthenticated, and consider handling loading state in component
// TODO: use auth url
function LoginContainer({ children }: any): JSX.Element {
  const router = useRouter()
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <>Loading</>
  }

  if (status === 'unauthenticated') {
    router.push('/api/auth/signin')
  }

  console.log(JSON.stringify(session))

  return children
}

function BackgroundImageContainer({ children }: any): JSX.Element {
  const { data, isLoading, error } = useSWR(`/api/user`, fetcher)
  if (isLoading) {
    return <>Loading user... </>
  }
  if (error) {
    return <>Error loading user</>
  }
  const user: User = data as any

  document.body.style.background = `url("${
    user?.wallpaperUrl || '/static/wallpapers/emma.jpg'
  }")`
  return (
    <Container maxWidth="lg">
      <>{children}</>
    </Container>
  )
}

// TODO: What is the accurate type here?
function MyApp({ Component, pageProps }: any): JSX.Element {
  const [searchQuery, setSearchQuery] = useState(
    parseSearchQuery('status:==:todo'), //
  ) // TODO: Convert this to an object that contains the parsed search components maybe?
  const [clientId] = useState(uuidv4())

  const customProps: AppProps = {
    clientId,
    searchQuery,
    setSearchQuery,
    ...pageProps,
  }

  // TODO: Remove login container
  // TODO: do I need custom and page props?
  return (
    <SessionProvider session={pageProps.session}>
      <LoginContainer>
        <Head>
          <meta name="description" content="Grimoire Automata" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <PrimaryAppBar {...customProps} />
        <BackgroundImageContainer>
          <Component {...customProps} />
        </BackgroundImageContainer>
      </LoginContainer>
    </SessionProvider>
  )
}

export default MyApp
