import Head from 'next/head'
import { useMutation, gql } from '@apollo/client'
import { useRouter } from 'next/router'

import { getContextUser } from 'lib/auth/server'
import { createNote } from 'lib/notes/server'
import { LoginContainer } from 'pages/_app'

const CREATE_NOTE_QUERY = gql`
  mutation CreateNote($createNoteData2: CreateNoteInput!) {
    createNote(data: $createNoteData2) {
      id
      version
      ownerId
      description
      title
      status
      due
      allDay
      createdAt
      updatedAt
    }
  }
`

const NotesNewView: any = async (props: any) => {
  const router = useRouter()
  const [updateNote, { data, loading, error, called }] =
    useMutation(CREATE_NOTE_QUERY)
  if (loading) return <>Updating note...</>
  if (error) return <>Error creating new note...</>
  if (!loading && !error && !called) {
    router.push(`/notes/${data.createNote.id}?edit=true`)
  }

  return (
    <LoginContainer>
      <Head>
        <title>{'Loading New Note'}</title>
      </Head>
      {updateNote({
        variables: {
          data: {
            note: '# ',
          },
        },
      })}
    </LoginContainer>
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
