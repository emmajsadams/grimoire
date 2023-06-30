import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import { formatTimeAgo } from 'lib/datetime'
import { User } from 'lib/prisma/client'

const LOADING_COMPONENT = <p>Loading User</p>

// TODO: Change this to automatically open edit view if a key is pressed, then close it if empty. Basically remove the delete draft button.
// TODO: automatically save draft every few seconds
// TODO: Convert this to two separate pages: ViewNote and EditNote
export function ViewUser(props: { user: User }): JSX.Element {
  const { user } = props

  if (!user) {
    return LOADING_COMPONENT
  }

  return (
    <Card variant="outlined" sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          <b>Name:</b> {user.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          <b>Email:</b> {user.email}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          <b>Created At:</b> {formatTimeAgo(user.createdAt as any)}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          <b>Updated At:</b> {formatTimeAgo(user.updatedAt as any)}
        </Typography>
      </CardContent>
    </Card>
  )
}
