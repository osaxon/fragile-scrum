export async function asyncMap<FromT, ToT>(
  iterable: Iterable<FromT>,
  asyncTransform: (a: FromT, i: number) => Promise<ToT>
): Promise<ToT[]> {
  let i = 0
  const promises: Promise<ToT>[] = []

  for (const item of iterable) {
    promises.push(asyncTransform(item, i))
    i++
  }
  return Promise.all(promises)
}
