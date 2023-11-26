import 'reflect-metadata'

import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

import { context } from 'lib/graphql/context'

// TODO: Move to crypto module
const saltRounds = 10

const app = async () => {
  const user = await context.prisma.user.findUnique({
    where: { email: process.env.ADMIN_EMAIL },
  })
  if (user) {
    console.log(
      `admin user ${process.env.ADMIN_EMAIL} already seeded with id=${user.id}`,
    )
  } else {
    const passwordHash = await bcrypt.hash(
      process.env.ADMIN_PASSWORD as any, // TODO: Fix typing
      saltRounds,
    )

    const user = await context.prisma.user.create({
      data: {
        name: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        password: passwordHash,
        emailVerified: new Date().toISOString(),
        wallpaperUrl: '/public/static/wallpapers/emma.jpg',
        calendarApiKey: uuidv4(),
      },
    })

    console.log(
      `admin user ${process.env.ADMIN_EMAIL} created with id=${user.id}`,
    )
  }
}

app()
