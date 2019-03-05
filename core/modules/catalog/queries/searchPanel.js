import SearchQuery from '@vue-storefront/core/lib/search/searchQuery'
import store from '@vue-storefront/core/store'

export function prepareQuickSearchQuery (queryText) {
  let searchQuery = new SearchQuery()

  searchQuery = searchQuery
    .setSearchText(queryText)
    .applyFilter({key: 'visibility', value: {'in': [3, 4]}})
    .applyFilter({key: 'status', value: {'in': [0, 1]}})/* 2 = disabled, 3 = out of stock */

  if (store.state.config.products.listOutOfStockProducts === false) {
    searchQuery = searchQuery.applyFilter({key: 'stock.is_in_stock', value: {'eq': true}})
  }

  return searchQuery
}
