import Head from 'next/head'

import { getContextUser } from 'lib/auth/server'
import { createNote } from 'lib/notes/server'

// TODO fix typing
// const NotesNewView: NextPage<any, any> = async (props: any): any => {
const NotesNewView: any = async (props: any) => {
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

export async function getServerSideProps(context: any): Promise<any> {
  const { user } = await getContextUser(context)
  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const note = await createNote({
    title: '# ',
    ownerId: user.id,
  } as any)

  return {
    redirect: {
      destination: `/notes/${(note as any).id}?edit=true`,
      permanent: false,
    },
  }
}
