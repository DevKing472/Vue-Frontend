import { Module } from 'vuex'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import RootState from '@vue-storefront/store/types/RootState'
import PromotedOffersState from '../types/PromotedOffersState'

export const module: Module<PromotedOffersState, RootState> = {
  namespaced: true,
  state: {
    banners: {
      mainBanners: [],
      smallBanners: [],
      productBanners: []
    }
  },
  getters,
  actions,
  mutations
}
