import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'

import { NotesCard } from 'lib/notes/components'
import { LoginContainer } from 'pages/_app'

// TODO: create a scaffold test notes feature for dev!
// TODO: Redirect to -> /notes by default and move NotesLists to that page
const Home: NextPage<any, any> = () => {
  return (
    <LoginContainer>
      <Head>
        <title>Grimoire Automata - Notes</title>
        <meta name="description" content="Grimoire Automata" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <NotesCard />
      </main>
    </LoginContainer>
  )
}

export default Home
