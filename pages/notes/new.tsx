import type { NextPage } from 'next'
import { createRecord } from 'thin-backend'
import { useRouter } from 'next/router'
import Head from 'next/head'

const NotesNewView: NextPage<any, any> = (props: any) => {
  const router = useRouter()

  router.push(`/notes/${props.id}`)

  return (
    <>
      <Head>
        <title>{'New Note'}</title>
      </Head>

      <main>
        <p>Redirecting to {props.id}</p>
      </main>
    </>
  )
}

export default NotesNewView

export async function getStaticProps() {
  const note = await createRecord('notes', {} as any)

  return {
    props: {
      id: note.id,
    },
  }
}
