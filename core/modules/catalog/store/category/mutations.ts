import Vue from 'vue'
import { MutationTree } from 'vuex'
import * as types from './mutation-types'
import { slugify, breadCrumbRoutes } from '@vue-storefront/store/helpers'
import { entityKeyName } from '@vue-storefront/store/lib/entities'
import CategoryState from '../../types/CategoryState'
import rootStore from '@vue-storefront/store'

const mutations: MutationTree<CategoryState> = {
  [types.CATEGORY_UPD_CURRENT_CATEGORY] (state, category) {
    state.current = category
    Vue.prototype.$bus.$emit('category-after-current', { category: category })
  },
  [types.CATEGORY_UPD_CURRENT_CATEGORY_PATH] (state, path) {
    state.current_path = path // TODO: store to cache
    state.breadcrumbs.routes = breadCrumbRoutes(state.current_path)
  },
  [types.CATEGORY_UPD_CATEGORIES] (state, categories) {
    for (let category of categories.items) {
      let catSlugSetter = (category) => {
        if (category.children_data) {
          for (let subcat of category.children_data) { // TODO: fixme and move slug setting to vue-storefront-api
            if (subcat.name) {
              subcat = Object.assign(subcat, { slug: (subcat.hasOwnProperty('url_key') && rootStore.state.config.products.useMagentoUrlKeys) ? subcat.url_key : (subcat.hasOwnProperty('name') ? slugify(subcat.name) + '-' + subcat.id : '') })
              catSlugSetter(subcat)
            }
          }
        }
      }
      catSlugSetter(category)
      if (categories.includeFields == null) {
        const catCollection = Vue.prototype.$db.categoriesCollection
        try {
          catCollection.setItem(entityKeyName('slug', category.slug.toLowerCase()), category).catch((reason) => {
            console.error(reason) // it doesn't work on SSR
          }) // populate cache by slug
          catCollection.setItem(entityKeyName('id', category.id), category).catch((reason) => {
            console.error(reason) // it doesn't work on SSR
          }) // populate cache by id
        } catch (e) {
          console.error(e)
        }
      }
    }
    if (state.list) {
      categories.items.map(newCat => {
        if (!state.list.find(existingCat => existingCat.id == newCat.id)) {
          state.list.push(newCat)
        }
      })
    } else {
      state.list = categories.items
    }
  },
  [types.CATEGORY_REMOVE_FILTERS] (state) {
    state.filters.chosen = {}
    state.current_product_query.configuration = {}
  },
  [types.CATEGORY_UPD_SEARCH_PRODUCT_QUERY] (state, newQuery) {
    state.current_product_query = newQuery
  }
}

export default mutations
