import Vue from 'vue'
import { ActionTree } from 'vuex'
import * as types from './mutation-types'
import i18n from '@vue-storefront/i18n'
import rootStore from '@vue-storefront/store'
import RootState from '@vue-storefront/store/types/RootState'
import CheckoutState from '../../types/CheckoutState'

const actions: ActionTree<CheckoutState, RootState> = {
  /**
   * Place order - send it to service worker queue
   * @param {Object} commit method
   * @param {Object} order order data to be send
   */
  placeOrder (context, { order }) {
    try {
      return context.dispatch('order/placeOrder', order, {root: true}).then(result => {
        if (!result.resultCode || result.resultCode === 200) {
          Vue.prototype.$db.usersCollection.setItem('last-cart-bypass-ts', new Date().getTime())
          context.dispatch('cart/clear', {}, {root: true})
          if (context.state.personalDetails.createAccount) {
            context.commit(types.CHECKOUT_DROP_PASSWORD)
          }
        }
      })
    } catch (e) {
      if (e.name === 'ValidationError') {
        console.error('Internal validation error; Order entity is not compliant with the schema', e.messages)
        rootStore.dispatch('notification/spawnNotification', {
          type: 'error',
          message: i18n.t('Internal validation error. Please check if all required fields are filled in. Please contact us on contributors@vuestorefront.io'),
          action1: { label: i18n.t('OK') }
        })
      } else {
        console.error(e)
      }
    }
  },
  savePersonalDetails ({ commit }, personalDetails) {
    // todo: create and move perdonal details vuex
    commit(types.CHECKOUT_SAVE_PERSONAL_DETAILS, personalDetails)
  },
  saveShippingDetails ({ commit }, shippingDetails) {
    // todo: move to shipping vuex
    commit(types.CHECKOUT_SAVE_SHIPPING_DETAILS, shippingDetails)
  },
  savePaymentDetails ({ commit }, paymentDetails) {
    // todo: move to payment vuex
    commit(types.CHECKOUT_SAVE_PAYMENT_DETAILS, paymentDetails)
  },
  load ({ commit }) {
    Vue.prototype.$db.checkoutFieldsCollection.getItem('personal-details', (err, details) => {
      if (err) throw new Error(err)
      if (details) {
        commit(types.CHECKOUT_LOAD_PERSONAL_DETAILS, details)
      }
    })
    Vue.prototype.$db.checkoutFieldsCollection.getItem('shipping-details', (err, details) => {
      if (err) throw new Error(err)
      if (details) {
        commit(types.CHECKOUT_LOAD_SHIPPING_DETAILS, details)
      }
    })
    Vue.prototype.$db.checkoutFieldsCollection.getItem('payment-details', (err, details) => {
      if (err) throw new Error(err)
      if (details) {
        commit(types.CHECKOUT_LOAD_PAYMENT_DETAILS, details)
      }
    })
  },
  updatePropValue ({ commit }, payload) {
    commit(types.CHECKOUT_UPDATE_PROP_VALUE, payload)
  },
  setThankYouPage ({ commit }, payload) {
    commit(types.CHECKOUT_SET_THANKYOU, payload)
  }
}

export default actions
