import Head from 'next/head'
import type { NextPage } from 'next'
import { useMutation, gql } from '@apollo/client'
import { useRouter } from 'next/router'

import { LoginContainer } from 'pages/_app'

const CREATE_NOTE_QUERY = gql`
  mutation CreateNote($data: CreateNoteInput!) {
    createNote(data: $data) {
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

const NotesNewView: NextPage<any, any> = () => {
  const router = useRouter()
  const [updateNote, { data, loading, error }] = useMutation(CREATE_NOTE_QUERY)
  if (loading) return <>Updating note...</>
  if (error) return <>Error creating new note...</>
  if (data) {
    router.push(`/notes/${data.createNote.id}?edit=true`)
  }

  return (
    <LoginContainer>
      <Head>
        <title>{'Loading New Note'}</title>
      </Head>
      <button
        onClick={() =>
          updateNote({
            variables: {
              data: {
                note: '# ',
              },
            },
          })
        }
      >
        Create Note
      </button>
    </LoginContainer>
  )
}

export default NotesNewView
