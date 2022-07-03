// TODO: Type this correctly
export function setQueryFilters(
  queryBuilder: any,
  searchQueryPart: any,
  property: any,
): any {
  if (searchQueryPart.operation === '==') {
    return queryBuilder.where(property, searchQueryPart.value)
  } else if (searchQueryPart.operation === '!=') {
    return queryBuilder.whereNot(property, searchQueryPart.value)
  }

  return queryBuilder
}
