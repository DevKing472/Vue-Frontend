import { Module } from 'vuex'
import actions from './actions'
import RootState from '@vue-storefront/store/types/RootState'
import StockState from '../../types/StockState'

export const stockModule: Module<StockState, RootState> = {
  namespaced: true,
  actions,
  state: {
    cache: {}
  }
}

