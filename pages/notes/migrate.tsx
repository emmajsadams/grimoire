import prisma from 'lib/prisma'

import postgres from 'postgres'

// move to examples directory
const MigrateView: any = (props: any) => {
  const { postgresNotes, thinNotes } = props

  let postgresNotesElement = <></>
  if (postgresNotes && postgresNotes.length > 0) {
    postgresNotesElement = (
      <>
        <p>Postgres Notes</p>
        <ul>
          {postgresNotes.map((note: any) => (
            <li key={note.title}>{JSON.stringify(note)}</li>
          ))}
        </ul>
      </>
    )
  }

  let thinNotesElement = <></>
  if (thinNotes && thinNotes.length > 0) {
    thinNotesElement = (
      <>
        <p>Thin Notes</p>
        <ul>
          {thinNotes.map((note: any) => (
            <li key={note.title}>{JSON.stringify(note)}</li>
          ))}
        </ul>
      </>
    )
  }

  return (
    <>
      {postgresNotesElement}
      <br />
      {thinNotesElement}
    </>
  )
}

export async function getServerSideProps() {
  await prisma.note.deleteMany({})

  const sql = postgres(process.env.THIN_DB_URL || '', {})
  let thinNotes = await sql`
      select
        id,
        title,
        due,
        status,
        all_day,
        description
      from notes
      where status != 'deleted'
        AND status != 'done'
        AND title != ''
    `
  for (const note of thinNotes) {
    delete note.id

    // Quick ugly hack to ignore new notes created with a default title
    if (note.title.startsWith('i ') || note.title.startsWith('# ')) {
      note.title = note.title.substring(2)
    }
    note.title = note.title.trim()
    note.ownerId = process.env.MIGRATE_USER_ID

    note.description = note.description.trim()

    if (note.due) {
      note.due = note.due.toISOString() as any
    } else {
      delete note.due
    }

    note.allDay = note.all_day
    delete note.all_day
  }

  await prisma.note.createMany({
    data: thinNotes as any,
    skipDuplicates: true,
  })

  const postgresNotes = await prisma.note.findMany({
    where: {
      NOT: {
        status: 'deleted',
      },
    },
  })
  for (let note of postgresNotes) {
    delete (note as any).id
    if (note.due) {
      note.due = note.due.toISOString() as any
    } else {
      delete (note as any).due
    }
    delete (note as any).version
    note.createdAt = (note.createdAt?.toISOString() as any) || ('' as any)
    note.updatedAt = (note.updatedAt?.toISOString() as any) || ('' as any)
  }

  return {
    props: {
      postgresNotes,
      thinNotes,
    },
  }
}

export default MigrateView
