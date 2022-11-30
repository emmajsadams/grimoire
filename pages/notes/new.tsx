import { createRecord } from 'thin-backend'
import { useRouter } from 'next/router'
import Head from 'next/head'

// TODO fix typing
// import type { NextPage } from 'next'
// const NotesNewView: NextPage<any, any> = async (props: any): any => {
const NotesNewView: any = async (props: any) => {
  const router = useRouter()
  const note = await createRecord('notes', {} as any)
  router.push(`/notes/${note.id}`)

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
