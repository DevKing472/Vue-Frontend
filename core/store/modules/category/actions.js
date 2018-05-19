import * as types from '../../mutation-types'
import { quickSearchByQuery } from '../../lib/search'
import { entityKeyName } from '../../lib/entities'
import EventBus from '../../lib/event-bus'
import config from '../../lib/config'
import rootStore from '../../'
import bodybuilder from 'bodybuilder'
import i18n from '../../lib/i18n'
import chunk from 'lodash-es/chunk'
import trim from 'lodash-es/trim'
import toString from 'lodash-es/toString'
import { optionLabel } from '../attribute/helpers'

export default {
  /**
   * Reset current category and path
   * @param {Object} context
   */
  reset (context) {
    context.commit(types.CATEGORY_UPD_CURRENT_CATEGORY_PATH, [])
    context.commit(types.CATEGORY_UPD_CURRENT_CATEGORY, {})
    rootStore.dispatch('stock/clearCache')
    EventBus.$emit('category-after-reset', { })
  },
  /**
   * Load categories within specified parent
   * @param {Object} commit promise
   * @param {Object} parent parent category
   */
  list (context, { parent = null, onlyActive = true, onlyNotEmpty = false, size = 4000, start = 0, sort = 'position:asc', includeFields = config.entities.optimize ? config.entities.category.includeFields : null }) {
    const commit = context.commit
    let qrObj = bodybuilder()
    if (parent && typeof parent !== 'undefined') {
      qrObj = qrObj.filter('term', 'parent_id', parent.id)
    }

    if (onlyActive === true) {
      qrObj = qrObj.andFilter('term', 'is_active', true) // show only active cateogires
    }

    if (onlyNotEmpty === true) {
      qrObj = qrObj.andFilter('range', 'product_count', {'gt': 0}) // show only active cateogires
    }

    if (!context.state.list | context.state.list.length === 0) {
      return quickSearchByQuery({ entityType: 'category', query: qrObj.build(), sort: sort, size: size, start: start, includeFields: includeFields }).then(function (resp) {
        commit(types.CATEGORY_UPD_CATEGORIES, resp)
        EventBus.$emit('category-after-list', { query: qrObj, sort: sort, size: size, start: start, list: resp })
        return resp
      }).catch(function (err) {
        console.error(err)
      })
    } else {
      return new Promise((resolve, reject) => {
        let resp = { items: context.state.list, total: context.state.list.length }
        EventBus.$emit('category-after-list', { query: qrObj, sort: sort, size: size, start: start, list: resp })
        resolve(resp)
      })
    }
  },

  /**
   * Load category object by specific field - using local storage/indexed Db
   * loadCategories() should be called at first!
   * @param {Object} commit
   * @param {String} key
   * @param {String} value
   * @param {Bool} setCurrentCategory default=true and means that state.current_category is set to the one loaded
   */
  single (context, { key, value, setCurrentCategory = true, setCurrentCategoryPath = true }) {
    const state = context.state
    const commit = context.commit
    const dispatch = context.dispatch

    return new Promise((resolve, reject) => {
      let setcat = (error, mainCategory) => {
        if (error) {
          console.error(error)
          reject(error)
        }

        if (setCurrentCategory) {
          commit(types.CATEGORY_UPD_CURRENT_CATEGORY, mainCategory)
        }
        if (setCurrentCategoryPath) {
          let currentPath = []
          let recurCatFinder = (category) => {
            if (!category) {
              return
            }
            if (category.parent_id) {
              dispatch('single', { key: 'id', value: category.parent_id, setCurrentCategory: false, setCurrentCategoryPath: false }).then((sc) => { // TODO: move it to the server side for one requests OR cache in indexedDb
                if (!sc) {
                  commit(types.CATEGORY_UPD_CURRENT_CATEGORY_PATH, currentPath)
                  EventBus.$emit('category-after-single', { category: mainCategory })
                  return resolve(mainCategory)
                }
                currentPath.unshift(sc)
                if (sc.parent_id) {
                  recurCatFinder(sc)
                }
              }).catch(err => {
                console.error(err)
                commit(types.CATEGORY_UPD_CURRENT_CATEGORY_PATH, currentPath) // this is the case when category is not binded to the root tree - for example 'Erin Recommends'
                resolve(mainCategory)
              })
            } else {
              commit(types.CATEGORY_UPD_CURRENT_CATEGORY_PATH, currentPath)
              EventBus.$emit('category-after-single', { category: mainCategory })
              resolve(mainCategory)
            }
          }
          if (typeof mainCategory !== 'undefined' && mainCategory.parent_id) {
            recurCatFinder(mainCategory) // TODO: Store breadcrumbs in IndexedDb for further usage to optimize speed?
          }
        } else {
          EventBus.$emit('category-after-single', { category: mainCategory })
          resolve(mainCategory)
        }
      }

      if (state.list.length > 0) { // SSR - there were some issues with using localForage, so it's the reason to use local state instead, when possible
        let category = state.list.find((itm) => { return itm[key] === value })
        // Check if category exists in the store OR we have recursively reached Default category (id=1)
        if (category || value === 1) {
          setcat(null, category)
        } else {
          reject(new Error('Category query returned empty result ' + key + ' = ' + value))
        }
      } else {
        const catCollection = global.$VS.db.categoriesCollection
        // Check if category does not exist in the store AND we haven't recursively reached Default category (id=1)
        if (!catCollection.getItem(entityKeyName(key, value), setcat) && value !== 1) {
          reject(new Error('Category query returned empty result ' + key + ' = ' + value))
        }
      }
    })
  },
  /**
   * Filter category products
   */
  products (context, { populateAggregations = false, filters = [], searchProductQuery, current = 0, perPage = 50, sort = '', includeFields = null, excludeFields = null, configuration = null, append = false }) {
    rootStore.state.category.current_product_query = {
      populateAggregations,
      filters,
      current,
      perPage,
      includeFields,
      excludeFields,
      configuration,
      append,
      sort
    }

    let prefetchGroupProducts = true
    if (config.entities.twoStageCaching && config.entities.optimize && !global.$VS.isSSR && !global.$VS.twoStageCachingDisabled) { // only client side, only when two stage caching enabled
      includeFields = config.entities.productListWithChildren.includeFields // we need configurable_children for filters to work
      excludeFields = config.entities.productListWithChildren.excludeFields
      prefetchGroupProducts = false
      console.log('Using two stage caching for performance optimization - executing first stage product pre-fetching')
    } else {
      prefetchGroupProducts = true
      if (global.$VS.twoStageCachingDisabled) {
        console.log('Two stage caching is disabled runtime because of no performance gain')
      } else {
        console.log('Two stage caching is disabled by the config')
      }
    }
    let t0 = new Date().getTime()
    let precachedQuery = searchProductQuery.build()
    let productPromise = rootStore.dispatch('product/list', {
      query: precachedQuery,
      start: current,
      size: perPage,
      excludeFields: excludeFields,
      includeFields: includeFields,
      configuration: configuration,
      append: append,
      sort: sort,
      updateState: true,
      prefetchGroupProducts: prefetchGroupProducts
    }).then(function (res) {
      let t1 = new Date().getTime()
      global.$VS.twoStageCachingDelta1 = t1 - t0

      let subloaders = []
      if (!res || (res.noresults)) {
        EventBus.$emit('notification', {
          type: 'warning',
          message: i18n.t('No products synchronized for this category. Please come back while online!'),
          action1: { label: i18n.t('OK'), action: 'close' }
        })
        if (!append) rootStore.dispatch('product/reset')
        rootStore.state.product.list = { items: [] } // no products to show TODO: refactor to rootStore.state.category.reset() and rootStore.state.product.reset()
        // rootStore.state.category.filters = { color: [], size: [], price: [] }
      } else {
        if (config.products.filterUnavailableVariants && config.products.configurableChildrenStockPrefetchStatic) { // prefetch the stock items
          const skus = []
          let prefetchIndex = 0
          res.items.map(i => {
            if (config.products.configurableChildrenStockPrefetchStaticPrefetchCount > 0) {
              if (prefetchIndex > config.products.configurableChildrenStockPrefetchStaticPrefetchCount) return
            }
            if (i.type_id === 'configurable' && i.configurable_children && i.configurable_children.length > 0) {
              for (const confChild of i.configurable_children) {
                const cachedItem = context.rootState.stock.cache[confChild.id]
                if (typeof cachedItem === 'undefined' || cachedItem === null) {
                  skus.push(confChild.sku)
                }
              }
              prefetchIndex++
            }
          })
          for (const chunkItem of chunk(skus, 15)) {
            rootStore.dispatch('stock/list', { skus: chunkItem }) // store it in the cache
          }
        }
        if (populateAggregations === true && res.aggregations) { // populate filter aggregates
          for (let attrToFilter of filters) { // fill out the filter options
            rootStore.state.category.filters.available[attrToFilter] = []

            let uniqueFilterValues = new Set()
            if (attrToFilter !== 'price') {
              if (res.aggregations['agg_terms_' + attrToFilter]) {
                let buckets = res.aggregations['agg_terms_' + attrToFilter].buckets
                if (res.aggregations['agg_terms_' + attrToFilter + '_options']) {
                  buckets = buckets.concat(res.aggregations['agg_terms_' + attrToFilter + '_options'].buckets)
                }

                for (let option of buckets) {
                  uniqueFilterValues.add(toString(option.key))
                }
              }

              for (let key of uniqueFilterValues.values()) {
                const label = optionLabel(rootStore.state.attribute, { attributeKey: attrToFilter, optionId: key })
                if (trim(label) !== '') { // is there any situation when label could be empty and we should still support it?
                  rootStore.state.category.filters.available[attrToFilter].push({
                    id: key,
                    label: label
                  })
                }
              }
            } else { // special case is range filter for prices
              if (res.aggregations['agg_range_' + attrToFilter]) {
                let index = 0
                let count = res.aggregations['agg_range_' + attrToFilter].buckets.length
                for (let option of res.aggregations['agg_range_' + attrToFilter].buckets) {
                  rootStore.state.category.filters.available[attrToFilter].push({
                    id: option.key,
                    from: option.from,
                    to: option.to,
                    label: (index === 0 || (index === count - 1)) ? (option.to ? '< $' + option.to : '> $' + option.from) : '$' + option.from + (option.to ? ' - ' + option.to : '')// TODO: add better way for formatting, extract currency sign
                  })
                  index++
                }
              }
            }
          }
        }
      }
      return subloaders
    }).catch((err) => {
      console.info(err)
      EventBus.$emit('notification', {
        type: 'warning',
        message: i18n.t('No products synchronized for this category. Please come back while online!'),
        action1: { label: i18n.t('OK'), action: 'close' }
      })
    })

    if (config.entities.twoStageCaching && config.entities.optimize && !global.$VS.isSSR && !global.$VS.twoStageCachingDisabled) { // second stage - request for caching entities
      console.log('Using two stage caching for performance optimization - executing second stage product caching') // TODO: in this case we can pre-fetch products in advance getting more products than set by pageSize
      rootStore.dispatch('product/list', {
        query: precachedQuery,
        start: current,
        size: perPage,
        excludeFields: null,
        includeFields: null,
        updateState: false // not update the product listing - this request is only for caching
      }).catch((err) => {
        console.info("Problem with second stage caching - couldn't store the data")
        console.info(err)
      }).then((res) => {
        let t2 = new Date().getTime()
        global.$VS.twoStageCachingDelta2 = t2 - t0
        console.log('Using two stage caching for performance optimization - Time comparison stage1 vs stage2', global.$VS.twoStageCachingDelta1, global.$VS.twoStageCachingDelta2)
        if (global.$VS.twoStageCachingDelta1 > global.$VS.twoStageCachingDelta2) { // two stage caching is not making any good
          global.$VS.twoStageCachingDisabled = true
          console.log('Disabling two stage caching')
        }
      })
    }
    return productPromise
  }
}
