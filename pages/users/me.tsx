import type { NextPage } from 'next'
import Head from 'next/head'

import { ViewUser } from 'lib/user/components'
import { AppProps } from 'pages/_app'
import { getCurrentUser } from 'lib/user/client'

interface NotesViewProps extends AppProps {}

// TODO: Change the name of clientID to requestID
const UserView: NextPage<any, any> = ({}: NotesViewProps) => {
  const { data, component } = getCurrentUser()
  if (component) {
    return component
  }
  const user = data
  if (!user) {
    return <p>Loading...</p>
  }

  // TODO: add breadcrumbs going back to main list view
  return (
    <>
      <Head>
        <title>{user.name}</title>
      </Head>

      <main>
        <ViewUser user={user}></ViewUser>
      </main>
    </>
  )
}

export default UserView
