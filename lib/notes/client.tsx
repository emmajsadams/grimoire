import useSWRMutation from 'swr/mutation'
import useSWR from 'swr'

import { fetcher } from 'lib/swr'
import { Note } from 'lib/prisma/client'

// TODO: Disable this once I uppercase these functions
/* eslint react-hooks/rules-of-hooks: "off" */

// TODO: type this and fix name for react component
// @ts-ignore
export function getNewNoteTrigger(): any {
  const { trigger } = useSWRMutation('/api/notes', (url, { arg }) =>
    fetcher(url, {
      method: 'POST',
      body: JSON.stringify(arg),
    } as any),
  )

  return trigger
}

// TODO: type this and fix name for react component
// @ts-ignore
export function getUpdateNoteTrigger(noteId: string): any {
  const { trigger } = useSWRMutation(`/api/notes/${noteId}`, (url, { arg }) =>
    fetcher(url, {
      method: 'PUT',
      body: JSON.stringify(arg),
    } as any),
  )

  return trigger
}

// TODO: type this and fix name for react component
// @ts-ignore
export function getNote(noteId: string): {
  data: Note | null
  component: any
} {
  const { data, error, isLoading } = useSWR(`/api/notes/${noteId}`, fetcher)

  // TODO: dedupe these
  if (error) {
    return {
      data: null,
      component: <p>Failed to load: {JSON.stringify(error)}</p>,
    }
  }
  if (isLoading) return { data: null, component: <p>Loading</p> }

  // TODO: type this
  return { data: data as any, component: null }
}

// TODO: type this and fix name for react component
// @ts-ignore
export function getNotes(query: string): {
  data: Note[] | null
  component: any
} {
  let url = `/api/notes?query=${query}`
  if (!query) {
    url = '/api/notes'
  }

  const { data, error, isLoading } = useSWR(url, fetcher)

  // TODO: dedupe these
  if (error)
    return {
      data: null,
      component: <p>Failed to load: {JSON.stringify(error)}</p>,
    }
  if (isLoading) return { data: null, component: <p>Loading</p> }

  // TODO: type this
  return { data: data as any, component: null }
}
