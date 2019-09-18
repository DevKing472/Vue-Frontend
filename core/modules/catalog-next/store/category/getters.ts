import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CategoryState from './CategoryState'
import { compareByLabel } from '../../helpers/categoryHelpers'
import { products } from 'config'
import FilterVariant from '../../types/FilterVariant'
import { optionLabel } from '../../helpers/optionLabel'
import trim from 'lodash-es/trim'
import toString from 'lodash-es/toString'
import forEach from 'lodash-es/forEach'
import { getFiltersFromQuery } from '../../helpers/filterHelpers'
import { Category } from '../../types/Category'
import { parseCategoryPath } from '@vue-storefront/core/modules/breadcrumbs/helpers'
import { _prepareCategoryPathIds, getSearchOptionsFromRouteParams } from '../../helpers/categoryHelpers';
import { removeStoreCodeFromRoute } from '@vue-storefront/core/lib/multistore'

const getters: GetterTree<CategoryState, RootState> = {
  getCategories: (state): Category[] => Object.values(state.categoriesMap),
  getCategoriesMap: (state): { [id: string]: Category} => state.categoriesMap,
  getCategoryProducts: (state) => state.products,
  getCategoryFrom: (state, getters) => (path: string = '') => {
    return getters.getCategories.find(category => (removeStoreCodeFromRoute(path) as string).replace(/^(\/)/gm, '') === category.url_path) || {}
  },
  getCategoryByParams: (state, getters, rootState) => (params: { [key: string]: string } = {}) => {
    return getters.getCategories.find(category => {
      let valueCheck = []
      const searchOptions = getSearchOptionsFromRouteParams(params)
      forEach(searchOptions, (value, key) => valueCheck.push(category[key] && category[key] === (category[key].constructor)(value)))
      return valueCheck.filter(check => check === true).length === Object.keys(searchOptions).length
    }) || {}
  },
  getCurrentCategory: (state, getters, rootState) => {
    return getters.getCategoryByParams(rootState.route.params)
  },
  getAvailableFiltersFrom: (state, getters, rootState) => (aggregations) => {
    const filters = {}
    if (aggregations) { // populate filter aggregates
      for (let attrToFilter of products.defaultFilters) { // fill out the filter options
        let filterOptions: FilterVariant[] = []

        let uniqueFilterValues = new Set<string>()
        if (attrToFilter !== 'price') {
          if (aggregations['agg_terms_' + attrToFilter]) {
            let buckets = aggregations['agg_terms_' + attrToFilter].buckets
            if (aggregations['agg_terms_' + attrToFilter + '_options']) {
              buckets = buckets.concat(aggregations['agg_terms_' + attrToFilter + '_options'].buckets)
            }

            for (let option of buckets) {
              uniqueFilterValues.add(toString(option.key))
            }
          }

          uniqueFilterValues.forEach(key => {
            const label = optionLabel(rootState.attribute, { attributeKey: attrToFilter, optionId: key })
            if (trim(label) !== '') { // is there any situation when label could be empty and we should still support it?
              filterOptions.push({
                id: key,
                label: label,
                type: attrToFilter
              })
            }
          });
          filters[attrToFilter] = filterOptions.sort(compareByLabel)
        } else { // special case is range filter for prices
          const storeView = rootState.storeView
          const currencySign = storeView.i18n.currencySign
          if (aggregations['agg_range_' + attrToFilter]) {
            let index = 0
            let count = aggregations['agg_range_' + attrToFilter].buckets.length
            for (let option of aggregations['agg_range_' + attrToFilter].buckets) {
              filterOptions.push({
                id: option.key,
                type: attrToFilter,
                from: option.from,
                to: option.to,
                label: (index === 0 || (index === count - 1)) ? (option.to ? '< ' + currencySign + option.to : '> ' + currencySign + option.from) : currencySign + option.from + (option.to ? ' - ' + option.to : ''), // TODO: add better way for formatting, extract currency sign
                single: true
              })
              index++
            }
            filters[attrToFilter] = filterOptions
          }
        }
      }
      // Add sort to available filters
      let variants = []
      Object.keys(products.sortByAttributes).map(label => {
        variants.push({
          label: label,
          id: products.sortByAttributes[label],
          type: 'sort'
        })
      })
      filters['sort'] = variants
    }
    return filters
  },
  getAvailableFilters: state => state.availableFilters,
  getCurrentFiltersFrom: (state, getters, rootState) => (filters) => {
    const currentQuery = filters || rootState.route[products.routerFiltersSource]
    return getFiltersFromQuery({availableFilters: getters.getAvailableFilters, filtersQuery: currentQuery})
  },
  getCurrentSearchQuery: (state, getters, rootState) => getters.getCurrentFiltersFrom(rootState.route[products.routerFiltersSource]),
  getCurrentFilters: (state, getters) => getters.getCurrentSearchQuery.filters,
  hasActiveFilters: (state, getters) => !!Object.keys(getters.getCurrentFilters).length,
  getSystemFilterNames: () => ['sort'],
  getBreadcrumbs: (state, getters) => getters.getBreadcrumbsFor(getters.getCurrentCategory),
  getBreadcrumbsFor: (state, getters) => category => {
    if (!category) return []
    const categoryHierarchyIds = _prepareCategoryPathIds(category)
    let resultCategoryList = categoryHierarchyIds.map(categoryId => {
      return getters.getCategoriesMap[categoryId]
    }).filter(c => !!c)
    return parseCategoryPath(resultCategoryList)
  },
  getCategorySearchProductsStats: state => state.searchProductsStats || {},
  getCategoryProductsTotal: (state, getters) => getters.getCategorySearchProductsStats.total || 0
}

export default getters
