import Vue from 'vue'
import Vuex from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'

Vue.use(Vuex)

const state = {
  version: '',
  __DEMO_MODE__: false,
  config: {},
  cart: {},
  checkout: {},
  cms: {},
  compare: {},
  product: {},
  shipping: {},
  user: {},
  ui: {},
  wishlist: {},
  attribute: '',
  category: {
    current_path: '',
    current_product_query: {},
    current: {
      slug: '',
      name: ''
    },
    filters: {}
  },
  stock: {
    cache: []
  },
  storeView: {},
  twoStageCachingDelta1: 0,
  twoStageCachingDelta2: 0,
  twoStageCachingDisabled: false,
  userTokenInvalidated: null,
  userTokenInvalidateAttemptsCount: 0,
  userTokenInvalidateLock: 0
}

let rootStore = new Vuex.Store<RootState>({
  // TODO: refactor it to return just the constructor to avoid event-bus and i18n shenigans; challenge: the singleton management OR add i18n and eventBus here to rootStore instance?  modules: {
  state
})

export default rootStore