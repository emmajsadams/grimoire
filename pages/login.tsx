import React, { useState } from 'react'
import type { NextPage } from 'next'
import { useMutation, gql } from '@apollo/client'
import { useRouter } from 'next/router'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

const LOGIN_USER = gql`
  mutation LoginUser($data: UserLoginInput!) {
    loginUser(data: $data)
  }
`

// TODO: create a scaffold test notes feature for dev!
// TODO: Redirect to -> /notes by default and move NotesLists to that page
const Login: NextPage<any, any> = () => {
  const componentType = typeof window === 'undefined' ? 'server' : 'client'
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginUser, { data, loading, error }] = useMutation(LOGIN_USER)
  if (loading) return <>Submitting...</>
  if (error) return <>{`Submission error! ${error.message}`}</>
  if (data && componentType === 'client') {
    localStorage.setItem('token', data.loginUser)
    router.push('/')
  }
  if (componentType === 'client') {
    document.body.style.background = `url("${'/static/wallpapers/emma.jpg'}")`
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Container maxWidth="lg">
        <Card variant="outlined" sx={{ minWidth: 275 }}>
          <CardContent>
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
              <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
              >
                <Grid item xs={4} />
                <Grid item xs={4}>
                  <Typography variant="h1" gutterBottom>
                    Grimoire Automata
                  </Typography>
                </Grid>
                <Grid item xs={4} />
              </Grid>
              <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
              >
                <Grid item xs={4} />
                <Grid item xs={4}>
                  <TextField
                    required
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Grid>
                <Grid item xs={4} />
              </Grid>
              <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
              >
                <Grid item xs={4} />
                <Grid item xs={4}>
                  <TextField
                    required
                    label="Password"
                    variant="outlined"
                    value={password}
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Grid>
                <Grid item xs={4} />
              </Grid>
              <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
              >
                <Grid item xs={4} />
                <Grid item xs={4}>
                  <Button type="submit">Login</Button>
                </Grid>
                <Grid item xs={4} />
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default Login
