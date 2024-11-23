# Grimoire

Basically a notes and calendar app I use for all my notes. Will expand on this further.

Live version open for user sign ups here https://grimoireautomata.com/. Please keep in mind I am not offering an encryption so it is possible for me to view any data created in production.

# Architecture

Will expand on each choice here eventually

- https://typegraphql.com
- https://www.apollographql.com/
- https://cloud.digitalocean.com/ - hosting graphql server
- https://www.prisma.io/docs/concepts/components/prisma-client/crud - PostgreSQL orm
- https://www.howtographql.com/graphql-js/6-authentication/ - auth jwt guide
- https://jwt.io/ guide
- https://raw.githubusercontent.com/prisma/prisma-examples/latest/typescript/graphql-typegraphql/prisma/seed.ts prisma seed script
- https://github.com/prisma/prisma-examples/blob/latest/typescript/graphql-typegraphql/src/UserResolver.ts user resolver example

## Local

`nvm use` is necessary to `npm install`

### Setup

- Use a linux based operating system. Might work on windows, but I do not test on that.
- Run `sudo apt-get update`
- Run `sudo apt-get install -y build-essential python` for bcrypt
- Install nvm https://github.com/nvm-sh/nvm
- Clone this repository
- `nvm install X` where X is the version of node in `.nvmrc`
- `nvm use` to change the node version of the current console to match that of `.nvmrc`. THIS MUST BE DONE EACH TIME YOU OPEN A NEW CONSOLE (unless you setup nvm to automatically do this on `cd`)

Both services currently connect to the production PostgresSQL database. In the future I would like to use a locker docker-compose file to setup a local postgres database. Then use a seeding script to setup data.

- http://localhost:4000/ - GraphQL server started by `npm run dev-graphql`
- http://localhost:3000/ - Next.JS server started by `npm run dev`

## Prod

- https://octopus-app-p952p.ondigitalocean.app/ - GraphQL server started by `npm run graphql`

## Environment Variables

- `DATABASE_URL` - Full url with credentials for PostgresSQL.
  - Local=In the future when I setup the local PostgresSQL server I'll post that url here. For now this cannot be checked into the repo since I use the PostgresSQL prod database.
- `SECRET` - A randomly generated string used for jwt signing. Just random letters, numbers and symbols. Around 24 characters should be fine. F
- `NEXT_PUBLIC_GRAPHQL_URL`
  - Local=http://localhost:4000/graphql
  - Prod=https://octopus-app-p952p.ondigitalocean.app/

## Currently Hosted

- Next.js Frontend - Vercel https://vercel.com/${VERCEL_PROJECT_ID}/grimoire
- PostgresSQL - SupaBase https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/settings/database
- GraphQL Backend - DigitalOcean https://sea-turtle-app-ogwal.ondigitalocean.app/
