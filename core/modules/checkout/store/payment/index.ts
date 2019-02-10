import { Module } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import PaymentState from '../../types/PaymentState'
import rootStore from '@vue-storefront/store'

export const paymentModule: Module<PaymentState, RootState> = {
  namespaced: true,
  state: {
    methods: [{"code":"cashondelivery","title":"Cash On Delivery","is_server_method":false}]
  },
  mutations: {
    addMethod (state, paymentMethod) {
      state.methods.push(paymentMethod)
    },
    replaceMethods (state, paymentMethods) {
      state.methods = paymentMethods
    }
  },
  actions: {
    addMethod ({commit}, paymentMethod) {
      commit('addMethod', paymentMethod)
    },
    replaceMethods ({commit}, paymentMethods) {
      commit('replaceMethods', paymentMethods)
    }
  },
  getters: {
    paymentMethods (state) {
      const isVirtualCart = rootStore.getters['cart/isVirtualCart']
      return state.methods.filter(method => { 
        return (!isVirtualCart || method.code !== 'cashondelivery')
       })
    }
  }
}
