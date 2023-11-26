import type { NextPage } from 'next'
import Head from 'next/head'
import { useQuery, useMutation, gql } from '@apollo/client'

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
      createdAt
      updatedAt
    }
  }
`

const REGENERATE_CALENDAR_API_KEY = gql`
  query RegenerateCalendarApiKey {
    regenerateCalendarApiKey {
      calendarApiKey
    }
  }
`

const UserView: NextPage<any, any> = () => {
  const { data, loading, error } = useQuery(GET_AUTHORIZED_USER_QUERY)

  // TODO: Add regenerate calendar key support
  // const [regenerateCalendarApiKey, regenerateCalendarApiKeyResponse] = useQuery(
  //   REGENERATE_CALENDAR_API_KEY,
  // )

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
