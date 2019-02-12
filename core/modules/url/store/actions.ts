import { UrlState } from '../types/UrlState'
import { ActionTree } from 'vuex';
import * as types from './mutation-types'
// you can use this storage if you want to enable offline capabilities
import { cacheStorage } from '../'
import { parseURLQuery } from '@vue-storefront/core/helpers'
import SearchQuery from '@vue-storefront/core/lib/search/searchQuery'

// it's a good practice for all actions to return Promises with effect of their execution
export const actions: ActionTree<UrlState, any> = {
  // if you want to use cache in your module you can load cached data like this
  registerMapping ({ commit }, { url, routeData }) {
    return new Promise ((resolve, reject) => {
      commit(types.REGISTER_MAPPING, { url, routeData })
      cacheStorage.setItem(url, routeData).then(result => {
        resolve(routeData)
      }).catch(() => reject())
    })
  },
  mapUrl ({ state, dispatch }, { url, query }) {
    const parsedQuery = typeof query === 'string' ? parseURLQuery(query) : query
    if (url && url[0] === '/') url = url.slice(1)
    const queryPos = url.indexOf('?')
    if (queryPos > 0) url = url.slice(0, queryPos)

    return new Promise ((resolve, reject) => {
      if (state.dispatcherMap.hasOwnProperty(url)) {
        return resolve (state.dispatcherMap[url])
      }
      cacheStorage.getItem(url).then(routeData => {
        if (routeData !== null) {
          return resolve(routeData)
        } else {
          dispatch('mappingFallback', { url, params: parsedQuery }).then(resolve).catch(reject)
        }
      }).catch(reject)
    })
  },
  /**
   * Router mapping fallback - get the proper URL from API
   * This method could be overriden in custom module to provide custom URL mapping logic
   */
  mappingFallback ({ commit, dispatch }, { url, params }) {
    return new Promise ((resolve, reject) => {
      const productQuery = new SearchQuery()
      productQuery.applyFilter({key: 'url_path', value: {'eq': url}}) // Tees category
      dispatch('product/list', { query: productQuery }, { root: true }).then((products) => {
       if (products && products.items.length > 0) {
          const product = products.items[0]
          resolve({
            name: product.type_id + '-product',
            parentSku: product.sku,
            childSku: params['childSku'] ? params['childSku'] : null
          })
        } else {
          dispatch('category/single', { key: 'url_path', value: url }, { root: true }).then((category) => {
            if (category !== null) {
              resolve({
                name: 'category',
                slug: category.slug
              })
            } else {
              resolve(null)
            }
          }).catch(e => reject(e))
        }
      }).catch(e => reject(e))


    })
  }
}