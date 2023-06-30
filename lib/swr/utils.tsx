// TODO: type this and fix name for react component
// @ts-ignore
export function defaultRequestHandler(
  data: any,
  error: any,
  isLoading: any,
): {
  data: any
  component: any
} {
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

//@ts-ignore
export function fetcher(...args): any {
  //@ts-ignore
  return fetch(...args).then((res) => {
    return res.json()
  })
}
