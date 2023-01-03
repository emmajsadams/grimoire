import type { NextPage } from 'next'
import Head from 'next/head'

import { NotesList } from 'lib/notes/NotesList'
import { AppProps } from 'pages/_app'

interface IndexProps extends AppProps {}

// TODO: Redirect to -> /notes by default and move NotesLists to that page
const Home: NextPage<any, any> = ({
  clientId,
  searchQuery,
  setSearchQuery,
}: IndexProps) => {
  return (
    <>
      <Head>
        <title>Grimoire Automata - Notes</title>
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
