import type { NextApiRequest, NextApiResponse } from 'next'

import { Note } from 'lib/prisma/client'
import { getApiUser } from 'lib/auth/server'
import prisma from 'lib/prisma'

// import { setQueryFilters } from 'lib/search'
// TODO: implement all this query support
// TODO: let orderby be set by filters???
// let notesQuery = query('notes').orderByAsc('due').orderByAsc('createdAt')
// if (searchQuery) {
//   if (
//     searchQuery.title.length == 0 ||
//     searchQuery.title[0].operation !== '=='
//   ) {
//     alert('Invalid query this should never happen')
//     searchQuery.errors.push('Invalid query this should never happen')
//   } else {
//     // TODO: move these loops into the query filters object
//     for (const searchQueryPart of searchQuery.status) {
//       notesQuery = setQueryFilters(notesQuery, searchQueryPart, 'status')
//     }

//     for (const searchQueryPart of searchQuery.due) {
//       notesQuery = setQueryFilters(notesQuery, searchQueryPart, 'due')
//     }

//     for (const searchQueryPart of searchQuery.tag) {
//       notesQuery = setQueryFilters(notesQuery, searchQueryPart, 'tag')
//     }

//     if (searchQuery.title[0].value !== '') {
//       notesQuery = notesQuery.whereTextSearchStartsWith(
//         'textSearch',
//         searchQuery.title[0].value,
//       )
//     }
//   }
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>,
) {
  // Validate the user is logged in and get their user object
  const { user } = await getApiUser(req, res)
  if (!user) {
    return
  }

  if (req.method === 'POST') {
    // Set the currently logged in user as the owner of the note, then create it!
    const note = JSON.parse(req.body) as Note
    note.ownerId = user.id
    const createdNote = await prisma.note.create({
      data: note,
    })
    return res.status(200).json(createdNote as any)
  } else if (req.method === 'GET') {
    let query = req.query.query as any
    // TODO: see above use actual query
    let notesWhere = {
      ownerId: user.id,
      status: 'todo', // TODO: change this to pull from the query
    } as any
    if (query) {
      if (query.startsWith('status:==:todo')) {
        query = query.replace('status:==:todo', '')
      }
      notesWhere.title = {
        contains: query,
        mode: 'insensitive',
      }
    }

    const notes = await prisma.note.findMany({
      where: notesWhere,
      orderBy: [
        {
          due: 'asc',
        },
        {
          createdAt: 'asc',
        },
      ],
    })

    return res.status(200).json(notes as any)
  } else {
    res.status(405).end()
    return
  }
}
