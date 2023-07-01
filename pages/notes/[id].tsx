import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { NoteCard } from 'lib/notes/components'
import { getNote } from 'lib/notes/client'

const NotesView: NextPage<any, any> = () => {
  const router = useRouter()
  const { id, edit } = router.query
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

  return (
    <>
      <Head>
        <title>{note.title ? note.title : 'New Note'}</title>
      </Head>

      <main>
        <NoteCard note={note} edit={(edit as any) === 'true' ? true : false} />
      </main>
    </>
  )
}

export default NotesView
