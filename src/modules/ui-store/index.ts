import { VueStorefrontModule, VueStorefrontModuleConfig } from '@vue-storefront/module'

// TODO: Move the logic to appropiate modules and depreciate this one

const KEY = 'ui'

const store = {
  namespaced: true,
  state: {
    sidebar: false,
    microcart: false,
    wishlist: false,
    searchpanel: false,
    newsletterPopup: false,
    overlay: false,
    loader: false,
    authElem: 'login',
    checkoutMode: false,
    openMyAccount: false,
    submenu: {
      depth: false,
      path: []
    }
  },
  mutations: {
    setCheckoutMode (state, action) {
      state.checkoutMode = action === true
    },
    setMicrocart (state, action) {
      state.microcart = action === true
      state.overlay = action === true
    },
    setSidebar (state, action) {
      state.sidebar = action === true
      state.overlay = action === true
    },
    setSubmenu (state, { id, depth }) {
      if (id) {
        state.submenu.path.push(id)
      } else if (state.submenu.path.length) {
        setTimeout(() => {
          state.submenu.path.pop()
        }, 300)
      }
      state.submenu.depth = state.submenu.depth > 0 && depth
    },
    setSearchpanel (state, action) {
      state.searchpanel = action === true
      state.overlay = action === true
    },
    setWishlist (state, action) {
      state.wishlist = action === true
      state.overlay = action === true
    },
    
    setOverlay (state, action) {
      state.overlay = action === true
    },
    setLoader (state, action) {
      state.loader = action === true
    },
    setAuthElem (state, action) {
      state.authElem = action
    }
  },
  actions: {
    toggleMicrocart ({ commit, state }) {
      commit('setMicrocart', !state.microcart)
    },
    toggleWishlist ({ commit, state }) {
      commit('setWishlist', !state.microcart)
    }
  }
}


const moduleConfig: VueStorefrontModuleConfig = {
  key: KEY,
  store: { modules: [{ key: KEY, module: store }] }
}

export const Ui = new VueStorefrontModule(moduleConfig)