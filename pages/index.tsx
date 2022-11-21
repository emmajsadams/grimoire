import type { NextPage } from 'next'
import Head from 'next/head'

import { NotesList } from 'lib/notes/NotesList'
import { AppProps } from 'pages/_app'

interface IndexProps extends AppProps {}

// TODO: Move this to notes/list? and maybe just redirect to notes list by default?
const Home: NextPage<any, any> = ({
  clientId,
  searchQuery,
  setSearchQuery,
}: IndexProps) => {
  return (
    <>
      <Head>
        <title>Notes</title>
        <meta name="description" content="Grimoire Automata" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <NotesList
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          clientId={clientId}
        />
      </main>
    </>
  )
}

export default Home
