import '../styles/globals.css'
import Head from 'next/head'
import { initThinBackend } from 'thin-backend'
import { ThinBackend } from 'thin-backend-react'
import { Container } from '@mui/material'
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { SessionProvider } from 'next-auth/react'
import { useSession } from 'next-auth/react'

import { PrimaryAppBar } from 'lib/navigation'
import { Query, parseSearchQuery } from 'lib/search'

initThinBackend({ host: process.env.NEXT_PUBLIC_BACKEND_URL })

export interface AppProps {
  clientId: string
  searchQuery: Query
  setSearchQuery: (query: Query) => void
}

// TODO: redirect unauthenticated, and consider handling loading state in component
// TODO: use auth url
function LoginContainer({ children }: any): JSX.Element {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <>Loading</>
  }

  if (status === 'unauthenticated') {
    return (
      <>
        <a href="/api/auth/signin">Login to access Grimoire</a>
      </>
    )
  }

  console.log(session?.user?.email)
  console.log(session?.user?.name)

  return children
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
  }

  return (
    <SessionProvider session={pageProps.session}>
      <LoginContainer>
        <ThinBackend requireLogin>
          <Head>
            <meta name="description" content="Grimoire Automata" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <PrimaryAppBar {...customProps} />
          <Container maxWidth="lg">
            <Component {...customProps} {...pageProps} />
          </Container>
        </ThinBackend>
      </LoginContainer>
    </SessionProvider>
  )
}
export default MyApp
