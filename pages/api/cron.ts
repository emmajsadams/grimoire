// TODO: figure out if I care about this
// import { getNotesWhere } from 'lib/notes/server'
// import { getUserWhere } from 'lib/users/server'

// export default async function handler(_: any, res: any) {
//   const notes = await getNotesWhere({
//     // find notes due in the next 30 minutes
//     due: {
//       gte: new Date(),
//       lte: new Date(new Date(Date.now() + 1000 * 60 * 30)),
//     },
//   })
//   if (!notes) {
//     return res.status(200).end('No notes due')
//   }

//   const notificationsGenerated = []
//   const ownerNtfyTopics: { [ownerId: string]: string } = {}
//   for (const note of notes) {
//     // this should never happen given the query above
//     if (!note.due) {
//       continue
//     }

//     let ownerNtfyTopic = ownerNtfyTopics[note.ownerId]
//     if (!ownerNtfyTopic) {
//       const owner = await getUserWhere({ id: note.ownerId })
//       // this should never happen, but if we can no longer find the owner for a note lets skip creating a notification
//       if (!owner) {
//         continue
//       }

//       // this could happen if the user has not configured a ntfy topic which is not configured by default
//       if (!owner.ntfyTopic) {
//         continue
//       }

//       ownerNtfyTopics[owner.id] = owner.ntfyTopic
//       ownerNtfyTopic = owner.ntfyTopic
//     }

//     const notificationText = `${note.title} due ${note.due.toISOString}`
//     fetch(`https://ntfy.sh/${ownerNtfyTopic}`, {
//       method: 'POST',
//       body: notificationText,
//     })
//     notificationsGenerated.push(notificationText)
//   }

//   res.status(200).end(JSON.stringify(notificationsGenerated))
// }
