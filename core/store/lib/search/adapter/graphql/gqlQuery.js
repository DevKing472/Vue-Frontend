export function prepareGraphQlBody (Query) {
  // @TODO Create graphQl query builder uses gqlQuery.body params
  // below is a simple demo test products search query

  let query = ``
  let queryVariables = {}
  const filters = Query.searchQuery.getAppliedFilters()

  switch (Query.type) {
    case 'product':
      query = require('./queries/products.gql')
      queryVariables.search = Query.searchQuery.getSearchText()
      break
    case 'attribute':
      query = require('./queries/customAttributeMetadata.gql')
      break
    default:
      break
  }

  queryVariables.sort = {}
  queryVariables.filter = {}

  // Add aggregations for filters
  const allFilters = Query.searchQuery.getAvailableFilters()
  if (allFilters.length > 0) {
    for (let attrToFilter of allFilters) {
      queryVariables.filter[attrToFilter.field] = {}
    }
  }

  for (let _filter of filters) {
    queryVariables.filter[_filter.attribute] = _filter.value
    if (_filter.scope) {
      _filter.value['scope'] = _filter.scope
    }
  }

  if (Query.sort !== '') {
    const sortParse = Query.sort.split(':')
    queryVariables.sort[sortParse[0]] = sortParse[1].toUpperCase()
  }

  queryVariables.pageSize = Query.size
  queryVariables.currentPage = Query.from / Query.size + 1
  queryVariables.attributes = queryVariables.filter

  const body = JSON.stringify({
    query,
    variables: queryVariables
  })

  return body
}
