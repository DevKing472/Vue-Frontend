import { Module } from 'vuex'
import actions from './actions'
import mutations from './mutations'
import RootState from '@vue-storefront/core/types/RootState'
import OrderState from '../types/OrderState'

export const module: Module<OrderState, RootState> = {
  namespaced: true,
  state: {
    last_order_confirmation: null
  },
  actions,
  mutations
}

