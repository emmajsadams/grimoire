import type { NextPage } from 'next'
import Head from 'next/head'
import { useQuery, gql } from '@apollo/client'

import { ViewUser } from 'lib/users/components'
import { LoginContainer } from 'pages/_app'

const GET_AUTHORIZED_USER_QUERY = gql`
  query GetAuthorizedUser {
    getAuthorizedUser {
      id
      userId
      email
      emailVerified
      image
      wallpaperUrl
      calendarApiKey
      ntfyTopic
      createdAt
      updatedAt
    }
  }
`

const UserView: NextPage<any, any> = () => {
  const { data, loading, error } = useQuery(GET_AUTHORIZED_USER_QUERY)
  if (loading) return <>Getting authorized user</>
  if (error) return <>{`Get error ${error.message}`}</>

  const user = data.getAuthorizedUser
  return (
    <LoginContainer>
      <Head>
        <title>{user.email}</title>
      </Head>

      <main>
        <ViewUser user={user}></ViewUser>
      </main>
    </LoginContainer>
  )
}

export default UserView
