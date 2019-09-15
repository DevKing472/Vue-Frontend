import Vue from 'vue'
import { MutationTree } from 'vuex'
import * as types from './mutation-types'
import CategoryState from './CategoryState'
import { Category } from '../../types/Category'

const mutations: MutationTree<CategoryState> = {
  [types.CATEGORY_SET_PRODUCTS] (state, products = []) {
    state.products = products
  },
  [types.CATEGORY_ADD_PRODUCTS] (state, products = []) {
    state.products.push(...products)
  },
  [types.CATEGORY_ADD_CATEGORY] (state, category: Category) {
    if (category) {
      Vue.set(state.categoriesMap, category.id, category)
    }
  },
  [types.CATEGORY_ADD_CATEGORIES] (state, categories: Category[] = []) {
    if (categories.length) {
      let newCategoriesEntry = {}
      categories.forEach(category => {
        newCategoriesEntry[category.id] = category
      })
      state.categoriesMap = Object.assign({}, state.categoriesMap, newCategoriesEntry)
    }
  },
  [types.CATEGORY_SET_CATEGORY_FILTERS] (state, {category, filters}) {
    state.filtersMap[category.id] = filters
  },
  [types.CATEGORY_SET_SEARCH_PRODUCTS_STATS] (state, stats = {}) {
    state.searchProductsStats = stats
  }
}

export default mutations
