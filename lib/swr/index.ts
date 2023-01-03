//@ts-ignore
export function fetcher(...args): any {
  //@ts-ignore
  return fetch(...args).then((res) => {
    return res.json()
  })
}
