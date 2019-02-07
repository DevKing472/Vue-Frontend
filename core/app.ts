import { Store } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import Vue from 'vue'
import buildTimeConfig from 'config'
import { isServer } from '@vue-storefront/core/helpers'
import { Logger } from '@vue-storefront/core/lib/logger'

// Plugins
import i18n from '@vue-storefront/i18n'
import VueRouter from 'vue-router'
import VueLazyload from 'vue-lazyload'
import Vuelidate from 'vuelidate'
import Meta from 'vue-meta'
import { sync } from 'vuex-router-sync'
import VueObserveVisibility from 'vue-observe-visibility'

// Apollo GraphQL client
import { getApolloProvider } from './scripts/resolvers/resolveGraphQL'

// TODO simplify by removing global mixins, plugins and filters - it can be done in normal 'vue' way
import { registerTheme } from '@vue-storefront/core/lib/themes'
import { themeEntry } from 'theme/index.js'
import { registerModules } from '@vue-storefront/core/lib/module'
import { prepareStoreView } from '@vue-storefront/core/lib/multistore'

import * as coreMixins from '@vue-storefront/core/mixins'
import * as coreFilters from '@vue-storefront/core/filters'
import * as corePlugins from '@vue-storefront/core/compatibility/plugins'

import { once } from '@vue-storefront/core/helpers'
import { takeOverConsole } from '@vue-storefront/core/helpers/log'
import store from '@vue-storefront/store'

import { enabledModules } from './modules-entry'

// Will be depreciated in 1.8
import { registerExtensions } from '@vue-storefront/core/compatibility/lib/extensions'
import { registerExtensions as extensions } from 'src/extensions'

function createRouter (): VueRouter {
  return new VueRouter({
    mode: 'history',
    base: __dirname,
    scrollBehavior: (to, from, savedPosition) => {
      if (to.hash) {
        return {
          selector: to.hash
        }
      }
      if (savedPosition) {
        return savedPosition
      } else {
        return {x: 0, y: 0}
      }
    }
  })
}

let router: VueRouter = null

Vue.use(VueRouter)

const createApp  = async (ssrContext, config): Promise<{app: Vue, router: VueRouter, store: Store<RootState>}> => {
  router = createRouter()
  // sync router with vuex 'router' store
  sync(store, router)
  // TODO: Don't mutate the state directly, use mutation instead
  store.state.version = '1.7.0'
  store.state.config = config
  store.state.__DEMO_MODE__ = (config.demomode === true) ? true : false
  if(ssrContext) Vue.prototype.$ssrRequestContext = ssrContext
  if (!store.state.config) store.state.config = buildTimeConfig // if provided from SSR, don't replace it

  const storeView = prepareStoreView(null) // prepare the default storeView
  store.state.storeView = storeView
  // store.state.shipping.methods = shippingMethods

  Vue.use(Vuelidate)
  Vue.use(VueLazyload, {attempt: 2, preLoad: 1.5})
  Vue.use(Meta)
  Vue.use(VueObserveVisibility)

  // to depreciate in near future
  once('__VUE_EXTEND__', () => {
    Object.keys(corePlugins).forEach(key => {
      Vue.use(corePlugins[key])
    })

    Object.keys(coreMixins).forEach(key => {
      Vue.mixin(coreMixins[key])
    })
  })

  Object.keys(coreFilters).forEach(key => {
    Vue.filter(key, coreFilters[key])
  })

  let vueOptions = {
    router,
    store,
    i18n,
    render: h => h(themeEntry)
  }

  const apolloProvider = await getApolloProvider()
  if (apolloProvider) Object.assign(vueOptions, {provider: apolloProvider})

  const app = new Vue(vueOptions)

  const appContext = {
    isServer,
    ssrContext
  }

  registerModules(enabledModules, appContext)
  registerExtensions(extensions, app, router, store, config, ssrContext)
  registerTheme(buildTimeConfig.theme, app, router, store, store.state.config, ssrContext)

  app.$emit('application-after-init', app)

  return { app, router, store }
}

export { router, createApp }
