import * as types from '../../mutation-types'

export default {
  /**
   * Add product to Compare
   * @param {Object} product data format for products is described in /doc/ElasticSearch data formats.md
   */
  [types.COMPARE_ADD_ITEM] (state, {product}) {
    const record = state.items.find(p => p.sku === product.sku)
    if (!record) {
      state.items.push({
        ...product
      })
    }
  },
  [types.COMPARE_DEL_ITEM] (state, {product}) {
    state.items = state.items.filter(p => p.sku !== product.sku)
  },
  [types.COMPARE_LOAD_COMPARE] (state, storedItems) {
    state.items = storedItems || []
  }
}
