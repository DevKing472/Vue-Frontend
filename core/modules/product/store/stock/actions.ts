import Vue from 'vue'
import { ActionTree } from 'vuex'
import i18n from '@vue-storefront/i18n'
// requires cart module
import * as types from '@vue-storefront/core/modules/cart/store/mutation-types'
import RootState from '@vue-storefront/store/types/RootState'
import StockState from '../../types/StockState'
import rootStore from '@vue-storefront/store'
const actions: ActionTree<StockState, RootState> = {
  /**
   * Reset current configuration and selected variatnts
   */
  check (context, { product, qty = 1 }) {
    return new Promise((resolve, reject) => {
      if (rootStore.state.config.stock.synchronize) {
        context.dispatch('sync/queue', { url: rootStore.state.config.stock.endpoint + '/check?sku=' + encodeURIComponent(product.sku),
          payload: {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors'
          },
          product_sku: product.sku,
          callback_event: 'store:stock/stockAfterCheck'
        }, { root: true }).then(task => {
          resolve({ qty: product.stock ? product.stock.qty : 0, status: product.stock ? (product.stock.is_in_stock ? 'ok' : 'out_of_stock') : 'ok', onlineCheckTaskId: task.task_id }) // if online we can return ok because it will be verified anyway
        })
      } else {
        resolve({ qty: product.stock ? product.stock.qty : 0, status: product.stock ? (product.stock.is_in_stock ? 'ok' : 'out_of_stock') : 'volatile' }) // if not online, cannot check the source of true here
      }
    })
  },
  /**
   * Reset current configuration and selected variatnts
   */
  list (context, { skus }) {
    return new Promise((resolve, reject) => {
      if (rootStore.state.config.stock.synchronize) {
        context.dispatch('sync/execute', { url: rootStore.state.config.stock.endpoint + '/list?skus=' + encodeURIComponent(skus.join(',')),
          payload: {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors'
          },
          skus: skus
        }, { root: true }).then(task => {
          if (task.resultCode === 200) {
            for (const si of task.result) {
              context.state.cache[si.product_id] = { is_in_stock: si.is_in_stock, qty: si.qty, product_id: si.product_id } // TODO: should be moved to mutation
            }
          }
          resolve(task) // if online we can return ok because it will be verified anyway
        }).catch((err) => {
          console.error(err)
          resolve(null)
        })
      } else {
        resolve(null) // if not online, cannot check the source of true here
      }
    })
  },
  clearCache (context) {
    context.state.cache = {}
  },
  stockAfterCheck (context, event) {
    setTimeout(() => {
      // TODO: Move to cart module
      rootStore.dispatch('cart/getItem', event.product_sku).then((cartItem) => {
        if (cartItem && event.result.code !== 'ENOTFOUND') {
          if (!event.result.is_in_stock) {
            if (!rootStore.state.config.stock.allowOutOfStockInCart) {
              console.log('Removing product from the cart', event.product_sku)
              rootStore.commit('cart/' + types.CART_DEL_ITEM, { product: { sku: event.product_sku } }, {root: true})
            } else {
              rootStore.dispatch('cart/updateItem', { product: { errors: { stock: i18n.t('Out of the stock!') }, sku: event.product_sku, is_in_stock: false } })
            }
          } else {
            rootStore.dispatch('cart/updateItem', { product: { info: { stock: i18n.t('In stock!') }, sku: event.product_sku, is_in_stock: true } })
          }
          Vue.prototype.$bus.$emit('cart-after-itemchanged', { item: cartItem })
        }
      })
      console.debug('Stock quantity checked for ' + event.result.product_id + ', response time: ' + (event.transmited_at - event.created_at) + ' ms')
      console.debug(event)
    }, 500)
  }
}

export default actions
