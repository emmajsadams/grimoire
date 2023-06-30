import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import { formatTimeAgo } from 'lib/datetime/utils'
import { User } from 'lib/prisma/client'

const LOADING_COMPONENT = <p>Loading User</p>

export function ViewUser(props: { user: User }): JSX.Element {
  const { user } = props

  if (!user) {
    return LOADING_COMPONENT
  }

  // TODO: Show image
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
          <b>Email Verified:</b>{' '}
          {user.emailVerified
            ? formatTimeAgo(user.emailVerified as any)
            : 'not verified'}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          <b>Created At:</b> {formatTimeAgo(user.createdAt as any)}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          <b>Updated At:</b> {formatTimeAgo(user.updatedAt as any)}
        </Typography>
        <hr />
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          <b>Wallpaper URL:</b> {user.wallpaperUrl}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          <b>Calendar API Key:</b> {user.calendarApiKey}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          <b>Ntfy Topic:</b> {user.ntfyTopic}
        </Typography>
      </CardContent>
    </Card>
  )
}
