const MigrateView: any = () => <p>TODO</p>

export default MigrateView

// import prisma from 'lib/prisma'

// import postgres from 'postgres'
// import { diffString } from 'json-diff'

// const MigrateView: any = (props) => {
//   const { postgresNotes, thinNotes } = props

//   let postgresNotesElement = <></>
//   if (postgresNotes && postgresNotes.length > 0) {
//     postgresNotesElement = (
//       <>
//         <p>Postgres Notes</p>
//         <ul>
//           {postgresNotes.map((note: any) => (
//             <li key={note.title}>{JSON.stringify(note)}</li>
//           ))}
//         </ul>
//       </>
//     )
//   }

//   let thinNotesElement = <></>
//   if (thinNotes && thinNotes.length > 0) {
//     thinNotesElement = (
//       <>
//         <p>Thin Notes</p>
//         <ul>
//           {thinNotes.map((note: any) => (
//             <li key={note.title}>{JSON.stringify(note)}</li>
//           ))}
//         </ul>
//       </>
//     )
//   }

//   console.log(diffString(postgresNotes, thinNotes))

//   return (
//     <>
//       {postgresNotesElement}
//       <br />
//       {thinNotesElement}
//     </>
//   )
// }

// export async function getServerSideProps() {
//   await prisma.note.deleteMany({})

//   const sql = postgres(process.env.THIN_DB_URL || '', {})
//   let thinNotes = await sql`
//       select
//         id,
//         title,
//         due,
//         status,
//         all_day,
//         description
//       from notes
//       where status != 'deleted'
//         AND status != 'done'
//         AND title != ''
//     `
//   for (const note of thinNotes) {
//     delete note.id

//     note.title = note.title.trim()
//     note.description = note.description.trim()

//     if (note.due) {
//       note.due = note.due.toISOString() as any
//     } else {
//       delete note.due
//     }

//     note.allDay = note.all_day
//     delete note.all_day
//   }

//   await prisma.note.createMany({
//     data: thinNotes,
//     skipDuplicates: true,
//   })

//   const postgresNotes = await prisma.note.findMany({
//     where: {
//       NOT: {
//         status: 'deleted',
//       },
//     },
//   })
//   for (const note of postgresNotes) {
//     delete note.id
//     if (note.due) {
//       note.due = note.due.toISOString() as any
//     } else {
//       delete note.due
//     }
//     delete note.version // note nneeded for repari
//   }

//   return {
//     props: {
//       postgresNotes,
//       thinNotes,
//     },
//   }
// }

// export default MigrateView
