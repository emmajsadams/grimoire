import { createRecord } from 'thin-backend'
import { useRouter } from 'next/router'
import Head from 'next/head'

import { getNewNoteTrigger } from 'lib/notes/client'

// TODO fix typing
// const NotesNewView: NextPage<any, any> = async (props: any): any => {
const NotesNewView: any = async (props: any) => {
  const router = useRouter()
  const newNoteTrigger = getNewNoteTrigger()

  newNoteTrigger({ title: '# ' }).then((note: any) => {
    router.push(`/notes/${note.id}`)
  })

  return (
    <>
      <Head>
        <title>{'Loading New Note'}</title>
      </Head>

      <main>
        <p>Redirecting to {props.id}</p>
      </main>
    </>
  )
}

export default NotesNewView
