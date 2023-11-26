import React, { useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { v4 as uuidv4 } from 'uuid'

import { formatTimeAgo } from 'lib/datetime/utils'
import { User } from 'lib/prisma/client'

export function ViewUser({ user }: { user: User }): JSX.Element {
  const [wallpaperUrl, setWallpaperUrl] = useState(user.wallpaperUrl)

  return (
    <Card variant="outlined" sx={{ minWidth: 275 }}>
      <CardContent>
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
          <b>Calendar API Key:</b>{' '}
          <a
            href={`/api/calendar/${user.calendarApiKey}`}
            target="_blank"
            rel="noreferrer"
          >
            {user.calendarApiKey}
          </a>
        </Typography>
        <Button onClick={() => setWallpaperUrl(uuidv4())}>
          Regenerate Wallpaper URL
        </Button>
      </CardContent>
    </Card>
  )
}
