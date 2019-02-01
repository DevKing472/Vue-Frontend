import Vue from 'vue'
import toString from 'lodash-es/toString'

import i18n from '@vue-storefront/i18n'
import store from '@vue-storefront/store'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'
import { baseFilterProductsQuery, buildFilterProductsQuery } from '@vue-storefront/core/helpers'
import { htmlDecode } from '@vue-storefront/core/filters/html-decode'
import { currentStoreView, localizedRoute } from '@vue-storefront/core/lib/multistore'
import Composite from '@vue-storefront/core/mixins/composite'
import { Logger } from '@vue-storefront/core/lib/logger'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Category',
  mixins: [Composite],
  data () {
    return {
      pagination: {
        perPage: 50,
        current: 0,
        enabled: false
      },
      bottom: false,
      lazyLoadProductsOnscroll: true
    }
  },
  computed: {
    ...mapGetters('category', ['getCurrentCategory', 'getCurrentCategoryProductQuery', 'getAllCategoryFilters', 'getCategoryBreadcrumbs', 'getCurrentCategoryPath']),
    products () {
      return this.$store.state.product.list.items
    },
    productsCounter () {
      return this.$store.state.product.list.items ? this.$store.state.product.list.items.length : 0
    },
    productsTotal () {
      return this.$store.state.product.list.total
    },
    currentQuery () {
      return this.getCurrentCategoryProductQuery
    },
    isCategoryEmpty () {
      return (!(this.$store.state.product.list.items) || this.$store.state.product.list.items.length === 0)
    },
    category () {
      return this.getCurrentCategory
    },
    categoryName () {
      return this.getCurrentCategory ? this.getCurrentCategory.name : ''
    },
    categoryId () {
      return this.getCurrentCategory ? this.getCurrentCategory.id : ''
    },
    filters () {
      return this.getAllCategoryFilters
    },
    breadcrumbs () {
      return this.getCategoryBreadcrumbs
    }
  },
  watch: {
    '$route': 'validateRoute',
    bottom (bottom) {
      if (bottom) {
        this.pullMoreProducts()
      }
    }
  },
  preAsyncData ({ store, route }) {
    Logger.log('preAsyncData query setup')()
    store.dispatch('category/setSearchOptions', {
      populateAggregations: true,
      store: store,
      route: route,
      current: 0,
      perPage: 50,
      sort: store.state.config.entities.productList.sort,
      filters: store.state.config.products.defaultFilters,
      includeFields: store.state.config.entities.optimize && Vue.prototype.$isServer ? store.state.config.entities.productList.includeFields : null,
      excludeFields: store.state.config.entities.optimize && Vue.prototype.$isServer ? store.state.config.entities.productList.excludeFields : null,
      append: false
    })
  },
  asyncData ({ store, route, context }) { // this is for SSR purposes to prefetch data
    return new Promise((resolve, reject) => {
      Logger.info('Entering asyncData in Category Page (core)')()
      if (context) context.output.cacheTags.add(`category`)
      const defaultFilters = store.state.config.products.defaultFilters
      store.dispatch('category/list', { level: store.state.config.entities.category.categoriesDynamicPrefetch && store.state.config.entities.category.categoriesDynamicPrefetchLevel ? store.state.config.entities.category.categoriesDynamicPrefetchLevel : null, includeFields: store.state.config.entities.optimize && Vue.prototype.$isServer ? store.state.config.entities.category.includeFields : null }).then((categories) => {
        store.dispatch('attribute/list', { // load filter attributes for this specific category
          filterValues: defaultFilters, // TODO: assign specific filters/ attribute codes dynamicaly to specific categories
          includeFields: store.state.config.entities.optimize && Vue.prototype.$isServer ? store.state.config.entities.attribute.includeFields : null
        }).catch(err => {
          Logger.error(err)()
          reject(err)
        }).then((attrs) => {
          store.dispatch('category/single', { key: store.state.config.products.useMagentoUrlKeys ? 'url_key' : 'slug', value: route.params.slug }).then((parentCategory) => {
            let query = store.getters['category/getCurrentCategoryProductQuery']
            if (!query.searchProductQuery) {
              store.dispatch('category/mergeSearchOptions', {
                searchProductQuery: baseFilterProductsQuery(parentCategory, defaultFilters)
              })
            }
            store.dispatch('category/products', query).then((subloaders) => {
              if (subloaders) {
                Promise.all(subloaders).then((results) => {
                  EventBus.$emitFilter('category-after-load', { store: store, route: route }).then((results) => {
                    return resolve()
                  }).catch((err) => {
                    Logger.error(err)()
                    return resolve()
                  })
                }).catch(err => {
                  Logger.error(err)()
                  reject(err)
                })
              } else {
                const err = new Error('Category query returned empty result')
                Logger.error(err)()
                reject(err)
              }
            }).catch(err => {
              Logger.error(err)()
              reject(err)
            })
          }).catch(err => {
            Logger.error(err)()
            reject(err)
          })
        })
      }).catch(err => {
        Logger.error(err)()
        reject(err)
      })
    })
  },
  beforeMount () {
    this.$bus.$on('filter-changed-category', this.onFilterChanged)
    this.$bus.$on('list-change-sort', this.onSortOrderChanged)
    if (store.state.config.usePriceTiers) {
      this.$bus.$on('user-after-loggedin', this.onUserPricesRefreshed)
      this.$bus.$on('user-after-logout', this.onUserPricesRefreshed)
    }
    if (!Vue.prototype.$isServer && this.lazyLoadProductsOnscroll) {
      window.addEventListener('scroll', () => {
        this.bottom = this.bottomVisible()
      }, {passive: true})
    }
  },
  beforeDestroy () {
    this.$bus.$off('list-change-sort', this.onSortOrderChanged)
    this.$bus.$off('filter-changed-category', this.onFilterChanged)
    if (store.state.config.usePriceTiers) {
      this.$bus.$off('user-after-loggedin', this.onUserPricesRefreshed)
      this.$bus.$off('user-after-logout', this.onUserPricesRefreshed)
    }
  },
  methods: {
    ...mapActions('category', ['mergeSearchOptions']),
    bottomVisible () {
      const scrollY = window.scrollY
      const visible = window.innerHeight
      const pageHeight = document.documentElement.scrollHeight
      const bottomOfPage = visible + scrollY >= pageHeight
      return bottomOfPage || pageHeight < visible
    },
    pullMoreProducts () {
      let current = this.getCurrentCategoryProductQuery.current + this.getCurrentCategoryProductQuery.perPage
      this.mergeSearchOptions({
        append: true,
        route: this.$route,
        store: this.$store,
        current
      })
      this.pagination.current = this.getCurrentCategoryProductQuery.current
      this.pagination.perPage = this.getCurrentCategoryProductQuery.perPage
      if (this.getCurrentCategoryProductQuery.current <= this.productsTotal) {
        this.mergeSearchOptions({
          searchProductQuery: buildFilterProductsQuery(this.category, this.filters.chosen)
        })
        return this.$store.dispatch('category/products', this.getCurrentCategoryProductQuery)
      }
    },
    onFilterChanged (filterOption) {
      this.pagination.current = 0
      if (this.filters.chosen[filterOption.attribute_code] && ((toString(filterOption.id) === toString(this.filters.chosen[filterOption.attribute_code].id)) || filterOption.id === this.filters.chosen[filterOption.attribute_code].id)) { // for price filter it's a string
        Vue.delete(this.filters.chosen, filterOption.attribute_code)
      } else {
        Vue.set(this.filters.chosen, filterOption.attribute_code, filterOption)
      }

      let filterQr = buildFilterProductsQuery(this.category, this.filters.chosen)

      const filtersConfig = Object.assign({}, this.filters.chosen) // create a copy because it will be used asynchronously (take a look below)
      this.mergeSearchOptions({
        populateAggregations: false,
        searchProductQuery: filterQr,
        current: this.pagination.current,
        perPage: this.pagination.perPage,
        configuration: filtersConfig,
        append: false,
        includeFields: null,
        excludeFields: null
      })
      this.$store.dispatch('category/products', this.getCurrentCategoryProductQuery).then((res) => {
      }) // because already aggregated
    },
    onSortOrderChanged (param) {
      this.pagination.current = 0
      if (param.attribute) {
        const filtersConfig = Object.assign({}, this.filters.chosen) // create a copy because it will be used asynchronously (take a look below)
        let filterQr = buildFilterProductsQuery(this.category, this.filters.chosen)
        this.mergeSearchOptions({
          sort: param.attribute,
          searchProductQuery: filterQr,
          current: this.pagination.current,
          perPage: this.pagination.perPage,
          configuration: filtersConfig,
          append: false,
          includeFields: null,
          excludeFields: null
        })
        this.$store.dispatch('category/products', this.getCurrentCategoryProductQuery).then((res) => {
        })
      } else {
        this.notify()
      }
    },
    validateRoute () {
      this.filters.chosen = {} // reset selected filters
      this.$bus.$emit('filter-reset')

      this.$store.dispatch('category/single', { key: this.$store.state.config.products.useMagentoUrlKeys ? 'url_key' : 'slug', value: this.$route.params.slug }).then(category => {
        if (!category) {
          this.$router.push(this.localizedRoute('/'))
        } else {
          this.pagination.current = 0
          let searchProductQuery = baseFilterProductsQuery(this.getCurrentCategory, store.state.config.products.defaultFilters)
          this.$bus.$emit('current-category-changed', this.getCurrentCategoryPath)
          this.mergeSearchOptions({ // base prototype from the asyncData is being used here
            current: this.pagination.current,
            perPage: this.pagination.perPage,
            store: this.$store,
            route: this.$route,
            append: false,
            populateAggregations: true
          })
          if (!this.getCurrentCategoryProductQuery.searchProductQuery) {
            this.mergeSearchOptions({
              searchProductQuery
            })
          }
          this.$store.dispatch('category/products', this.getCurrentCategoryProductQuery)
          EventBus.$emitFilter('category-after-load', { store: this.$store, route: this.$route })
        }
      }).catch(err => {
        if (err.message.indexOf('query returned empty result') > 0) {
          this.$store.dispatch('notification/spawnNotification', {
            type: 'error',
            message: i18n.t('The product, category or CMS page is not available in Offline mode. Redirecting to Home.'),
            action1: { label: i18n.t('OK') }
          })
          this.$router.push(localizedRoute('/', currentStoreView().storeCode))
        }
      })
    },
    onUserPricesRefreshed () {
      const defaultFilters = store.state.config.products.defaultFilters
      this.$store.dispatch('category/single', {
        key: this.$store.state.config.products.useMagentoUrlKeys ? 'url_key' : 'slug',
        value: this.$route.params.slug
      }).then((parentCategory) => {
        if (!this.getCurrentCategoryProductQuery.searchProductQuery) {
          this.mergeSearchOptions({
            searchProductQuery: baseFilterProductsQuery(parentCategory, defaultFilters),
            skipCache: true
          })
        }
        this.$store.dispatch('category/products', this.getCurrentCategoryProductQuery)
      })
    }
  },
  metaInfo () {
    const storeView = currentStoreView()
    return {
      link: [
        { rel: 'amphtml',
          href: this.$router.resolve(localizedRoute({
            name: 'category-amp',
            params: {
              slug: this.category.slug
            }
          }, storeView.storeCode)).href
        }
      ],
      title: htmlDecode(this.category.meta_title || this.categoryName),
      meta: this.category.meta_description ? [{ vmid: 'description', description: htmlDecode(this.category.meta_description) }] : []
    }
  }
}
