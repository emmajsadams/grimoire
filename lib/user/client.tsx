import useSWRMutation from 'swr/mutation'
import useSWR from 'swr'

import { fetcher } from 'lib/swr'
import { User } from 'lib/prisma/client'
import { defaultRequestHandler } from 'lib/utils/request'

// TODO: Disable this once I uppercase these functions
/* eslint react-hooks/rules-of-hooks: "off" */

// TODO: type this and fix name for react component
// @ts-ignore
export function updateCurrentUser(): any {
  const { trigger } = useSWRMutation(`/api/user`, (url, { arg }) =>
    fetcher(url, {
      method: 'PUT',
      body: JSON.stringify(arg),
    } as any),
  )

  return trigger
}

// TODO: type this and fix name for react component
// @ts-ignore
export function getCurrentUser(): {
  data: User | null
  component: any
} {
  const { data, error, isLoading } = useSWR(`/api/user`, fetcher)

  return defaultRequestHandler(data, error, isLoading)
}
