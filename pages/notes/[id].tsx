import type { NextPage } from 'next'
import Head from 'next/head'
import { query } from 'thin-backend'
import { useQuery } from 'thin-backend-react'
import { useRouter } from 'next/router'

import { ViewNote } from 'lib/notes'
import { AppProps } from 'pages/_app'

interface NotesViewProps extends AppProps {}

// TODO: Change the name of clientID to requestID
const NotesView: NextPage<any, any> = ({ clientId }: NotesViewProps) => {
  const router = useRouter()
  const { id } = router.query

  const notes = useQuery(
    query('notes')
      .where('id', id as string)
      .limit(1),
  )

  if (!notes) {
    return <p>Loading</p>
  }

  if (notes.length != 1) {
    return <p>Note not found, please check the ID</p>
  }

  const note = notes[0]

  // TODO: add breadcrumbs going back to main list view
  return (
    <>
      <Head>
        <title>{note.title ? note.title : 'New Note'}</title>
      </Head>

      <main>
        <ViewNote note={note} clientId={clientId}></ViewNote>
      </main>
    </>
  )
}

export default NotesView
