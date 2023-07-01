import type { NextPage } from 'next'
import Head from 'next/head'

import { NotesCard } from 'lib/notes/components'
import { AppProps } from 'pages/_app'

interface IndexProps extends AppProps {}

// TODO: create a scaffold test notes feature for dev!
// TODO: Redirect to -> /notes by default and move NotesLists to that page
const Home: NextPage<any, any> = ({
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
        <NotesCard searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </main>
    </>
  )
}

export default Home
