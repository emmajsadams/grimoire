import type { Prisma } from 'lib/prisma/client'

// TODO: Support more than just status ==
export function parseSearchQuery(
  searchQuery: string,
): Prisma.NoteAggregateArgs {
  const query: Prisma.NoteAggregateArgs = {
    where: {
      NOT: {
        OR: [
          {
            status: 'done',
          },
          {
            status: 'deleted',
          },
        ],
      },
    },
    orderBy: [
      {
        due: 'asc',
      },
      {
        createdAt: 'asc',
      },
    ],
  }

  const stringQueryParts = searchQuery.trim().split(' ')
  for (const stringQueryPart of stringQueryParts) {
    if (!stringQueryPart) {
      continue
    }

    if (stringQueryPart.startsWith('status==')) {
      ;(query.where as any).status = stringQueryPart.replaceAll('status==', '')
      continue
    }

    ;(query.where as any).title = {
      contains: stringQueryPart,
      mode: 'insensitive',
    }
  }

  return query
}
