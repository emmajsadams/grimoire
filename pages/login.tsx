import React, { useState } from 'react'
import type { NextPage } from 'next'
import { useMutation, gql } from '@apollo/client'
import { useRouter } from 'next/router'
import TextField from '@mui/material/TextField'

const LOGIN_USER = gql`
  mutation LoginUser($data: UserLoginInput!) {
    loginUser(data: $data)
  }
`

// TODO: create a scaffold test notes feature for dev!
// TODO: Redirect to -> /notes by default and move NotesLists to that page
const Login: NextPage<any, any> = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginUser, { data, loading, error }] = useMutation(LOGIN_USER)
  if (loading) return <>Submitting...</>
  if (error) return <>{`Submission error! ${error.message}`}</>
  if (data) {
    localStorage.setItem('token', data.loginUser)
    router.push('/')
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          loginUser({
            variables: {
              data: {
                email,
                password,
              },
            },
          })
        }}
      >
        <TextField
          label="Outlined"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Outlined"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </>
  )
}

export default Login
