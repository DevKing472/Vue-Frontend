import rootStore from '@vue-storefront/store'
import SearchQuery from '@vue-storefront/core/lib/search/searchQuery'
import { remove as removeAccents } from 'remove-accents'
import { Logger } from '@vue-storefront/core/lib/logger'

/**
 * Create slugify -> "create-slugify" permalink  of text
 * @param {String} text
 */
export function slugify (text) {
  // remove regional characters
  text = removeAccents(text)

  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
}

/**
 * @param relativeUrl
 * @param width
 * @param height
 * @returns {*}
 */
export function getThumbnailPath (relativeUrl, width, height) {
  if (rootStore.state.config.images.useExactUrlsNoProxy) {
    return relativeUrl // this is exact url mode
  } else {
    let resultUrl
    if (relativeUrl && (relativeUrl.indexOf('://') > 0 || relativeUrl.indexOf('?') > 0 || relativeUrl.indexOf('&') > 0)) relativeUrl = encodeURIComponent(relativeUrl)
    let baseUrl = rootStore.state.config.images.proxyUrl ? rootStore.state.config.images.proxyUrl : rootStore.state.config.images.baseUrl // proxyUrl is not a url base path but contains {{url}} parameters and so on to use the relativeUrl as a template value and then do the image proxy opertions
    if (baseUrl.indexOf('{{') >= 0) {
      baseUrl = baseUrl.replace('{{url}}', relativeUrl)
      baseUrl = baseUrl.replace('{{width}}', width)
      baseUrl = baseUrl.replace('{{height}}', height)
      resultUrl = baseUrl
    } else {
      resultUrl = `${baseUrl}${parseInt(width)}/${parseInt(height)}/resize${relativeUrl}`
    }
    return relativeUrl && relativeUrl.indexOf('no_selection') < 0 ? resultUrl : rootStore.state.config.images.productPlaceholder || ''
  }
}

/**
 * Re-format category path to be suitable for breadcrumb
 * @param {Array} categoryPath
 */
export function breadCrumbRoutes (categoryPath) {
  const tmpRts = []
  for (let sc of categoryPath) {
    tmpRts.push({
      name: sc.name,
      route_link: (rootStore.state.config.products.useShortCatalogUrls ? '/' : '/c/') + sc.slug
    })
  }

  return tmpRts
}

/**
 * Return configurable product thumbnail depending on the configurable_children
 * @param {object} product
 * @param {bool} ignoreConfig
 */
export function productThumbnailPath (product, ignoreConfig = false) {
  let thumbnail = product.image
  if ((product.type_id && product.type_id === 'configurable') && product.hasOwnProperty('configurable_children') &&
    product.configurable_children.length && (ignoreConfig || !product.is_configured) &&
    ('image' in product.configurable_children[0])
  ) {
    thumbnail = product.configurable_children[0].image
    if (!thumbnail || thumbnail === 'no_selection') {
      const childWithImg = product.configurable_children.find(f => f.image && f.image !== 'no_selection')
      if (childWithImg) {
        thumbnail = childWithImg.image
      } else {
        thumbnail = product.image
      }
    }
  }
  return thumbnail
}

export function buildFilterProductsQuery (currentCategory, chosenFilters, defaultFilters = null) {
  let filterQr = baseFilterProductsQuery(currentCategory, defaultFilters == null ? rootStore.state.config.products.defaultFilters : defaultFilters)

  // add choosedn filters
  for (let code of Object.keys(chosenFilters)) {
    const filter = chosenFilters[code]

    if (filter.attribute_code !== 'price') {
      filterQr = filterQr.applyFilter({key: filter.attribute_code, value: {'eq': filter.id}, scope: 'catalog'})
    } else { // multi should be possible filter here?
      const rangeqr = {}
      if (filter.from) {
        rangeqr['gte'] = filter.from
      }
      if (filter.to) {
        rangeqr['lte'] = filter.to
      }
      filterQr = filterQr.applyFilter({key: filter.attribute_code, value: rangeqr, scope: 'catalog'})
    }
  }

  return filterQr
}

export function baseFilterProductsQuery (parentCategory, filters = []) { // TODO add aggregation of color_options and size_options fields
  let searchProductQuery = new SearchQuery()
  searchProductQuery = searchProductQuery
    .applyFilter({key: 'visibility', value: {'in': [2, 3, 4]}})
    .applyFilter({key: 'status', value: {'in': [0, 1]}}) /* 2 = disabled, 4 = out of stock */

  if (rootStore.state.config.products.listOutOfStockProducts === false) {
    searchProductQuery = searchProductQuery.applyFilter({key: 'stock.is_in_stock', value: {'eq': true}})
  }
  // Add available catalog filters
  for (let attrToFilter of filters) {
    searchProductQuery = searchProductQuery.addAvailableFilter({field: attrToFilter, scope: 'catalog'})
  }

  let childCats = [parentCategory.id]
  if (parentCategory.children_data) {
    let recurCatFinderBuilder = (category) => {
      if (!category) {
        return
      }

      if (!category.children_data) {
        return
      }

      for (let sc of category.children_data) {
        if (sc && sc.id) {
          childCats.push(sc.id)
        }
        recurCatFinderBuilder(sc)
      }
    }
    recurCatFinderBuilder(parentCategory)
  }
  searchProductQuery = searchProductQuery.applyFilter({key: 'category_ids', value: {'in': childCats}})
  return searchProductQuery
}


export function once (key, fn) {
  const { process = {} } = global
  const processKey = key + '__ONCE__'
  if (!process.hasOwnProperty(processKey)) {
    Logger.debug(`Once ${key}`, 'helper')()
    process[processKey] = true
    fn()
  }
}

export const isServer: boolean = typeof window === 'undefined'
