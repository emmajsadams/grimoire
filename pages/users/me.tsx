import type { NextPage } from 'next'
import Head from 'next/head'

import { ViewUser } from 'lib/users/components'
import { getCurrentUser } from 'lib/users/client'

const UserView: NextPage<any, any> = () => {
  const { data, component } = getCurrentUser()
  if (component) {
    return component
  }
  const user = data
  if (!user) {
    return <p>Loading...</p>
  }

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
