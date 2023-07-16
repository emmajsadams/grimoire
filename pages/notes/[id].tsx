import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import { ViewNoteCard, EditNoteCard } from 'lib/notes/components'
import { LoginContainer } from 'pages/_app'

const NotesView: NextPage<any, any> = () => {
  const router = useRouter()
  const { id, edit } = router.query
  if (!id) {
    // TODO: use a function to validate the id matches expectations
    return <p>ID is not defined</p>
  }
  if (Array.isArray(id)) {
    return <>ID must be a single value</>
  }

  const editBool = (edit as any) === 'true' ? true : false

  return (
    <LoginContainer>
      <main>
        {editBool ? <EditNoteCard id={id} /> : <ViewNoteCard id={id} />}
      </main>
    </LoginContainer>
  )
}

export default NotesView
