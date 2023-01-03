import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { ViewNote } from 'lib/notes'
import { AppProps } from 'pages/_app'
import { getNote } from 'lib/notes/client'

interface NotesViewProps extends AppProps {}

// TODO: Change the name of clientID to requestID
const NotesView: NextPage<any, any> = ({ clientId }: NotesViewProps) => {
  const router = useRouter()
  const { id } = router.query
  if (!id) {
    // TODO: use a function to validate the id matches expectations
    return <p>ID is not defined</p>
  }

  const { data, component } = getNote(id as any)
  if (component) {
    return component
  }
  const note = data
  if (!note) {
    return <p>Loading...</p>
  }

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
