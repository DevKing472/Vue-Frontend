import { Module } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import ShippingState from '../../types/ShippingState'
import config from 'config'

export const shippingModule: Module<ShippingState, RootState> = {
  namespaced: true,
  state: {
    methods: config.shipping.methods
  },
  mutations: {
    addMethod (state, shippingMethods) {
      state.methods.push(shippingMethods)
    },
    replaceMethods (state, shippingMethods) {
      state.methods = shippingMethods
    }
  },
  actions: {
    addMethod ({commit}, shippingMethod) {
      commit('addMethod', shippingMethod)
    },
    replaceMethods ({commit}, shippingMethods) {
      commit('replaceMethods', shippingMethods)
    }
  },
  getters: {
    shippingMethods: state => state.methods,
    getDefaultShippingMethod: state => state.methods.find(item => item.default)
  }
}
