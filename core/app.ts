import { VSFRouter } from '@vue-storefront/core/types/VSFRouter';
import { RouterManager } from '@vue-storefront/core/lib/router-manager';
import { Store } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import Vue from 'vue'
import { isServer } from '@vue-storefront/core/helpers'

// Plugins
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'
import i18n from '@vue-storefront/i18n'
import VueRouter, { RouteConfig } from 'vue-router'
import VueLazyload from 'vue-lazyload'
import Vuelidate from 'vuelidate'
import Meta from 'vue-meta'
import { sync } from 'vuex-router-sync'
import VueObserveVisibility from 'vue-observe-visibility'
import cloneDeep from 'lodash-es/cloneDeep'
import omit from 'lodash-es/omit'
// Apollo GraphQL client
import { getApolloProvider } from './scripts/resolvers/resolveGraphQL'

// TODO simplify by removing global mixins, plugins and filters - it can be done in normal 'vue' way
import { registerTheme } from '@vue-storefront/core/lib/themes'
import { themeEntry } from 'theme/index.js'
import { registerModules } from '@vue-storefront/core/lib/module'
import { prepareStoreView, currentStoreView } from '@vue-storefront/core/lib/multistore'

import * as coreMixins from '@vue-storefront/core/mixins'
import * as coreFilters from '@vue-storefront/core/filters'
import * as corePlugins from '@vue-storefront/core/compatibility/plugins'

import { once } from '@vue-storefront/core/helpers'
import store from '@vue-storefront/core/store'

import { enabledModules } from './modules-entry'

import globalConfig from 'config'

import { injectReferences } from '@vue-storefront/core/lib/modules'
import { coreHooksExecutors } from '@vue-storefront/core/hooks'
import { registerClientModules } from 'src/modules/client';

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
      } else if (to.path !== from.path) { // do not change scroll position when navigating on the same page (ex. change filters)
        return {x: 0, y: 0}
      }
    }
  })
}

function createRouterProxy (router: VueRouter): VSFRouter {
  const ProxyConstructor = Proxy || require('proxy-polyfill/src/proxy')

  return new ProxyConstructor(router, {
    get (target, propKey) {
      const origMethod = target[propKey];

      if (propKey === 'addRoutes') {
        return function (routes: RouteConfig[], ...args): void {
          return RouterManager.addRoutes(routes, ...args);
        };
      }

      return origMethod;
    }
  })
}

let router: VueRouter = null
let routerProxy: VSFRouter = null

once('__VUE_EXTEND_RR__', () => {
  Vue.use(VueRouter)
})

const createApp = async (ssrContext, config, storeCode = null): Promise<{app: Vue, router: VueRouter, store: Store<RootState>, initialState: RootState}> => {
  router = createRouter()
  routerProxy = createRouterProxy(router)
  // sync router with vuex 'router' store
  sync(store, routerProxy)
  // TODO: Don't mutate the state directly, use mutation instead
  store.state.version = process.env.APPVERSION
  store.state.config = config // @deprecated
  store.state.__DEMO_MODE__ = (config.demomode === true)
  if (ssrContext) Vue.prototype.$ssrRequestContext = ssrContext
  if (!store.state.config) store.state.config = globalConfig //  @deprecated - we should avoid the `config`
  const storeView = prepareStoreView(storeCode) // prepare the default storeView
  store.state.storeView = storeView

  // @deprecated from 2.0
  once('__VUE_EXTEND__', () => {
    Vue.use(Vuelidate)
    Vue.use(VueLazyload, {attempt: 2, preLoad: 1.5})
    Vue.use(Meta)
    Vue.use(VueObserveVisibility)

    Object.keys(corePlugins).forEach(key => {
      Vue.use(corePlugins[key])
    })

    Object.keys(coreMixins).forEach(key => {
      Vue.mixin(coreMixins[key])
    })
  })

  // @todo remove this part when we'll get rid of global multistore mixin
  if (isServer) {
    Object.defineProperty(ssrContext, 'helpers', {
      value: {
        currentStoreView
      },
      writable: true
    })
  }

  Object.keys(coreFilters).forEach(key => {
    Vue.filter(key, coreFilters[key])
  })

  let vueOptions = {
    router: routerProxy,
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

  injectReferences(app, store, routerProxy, globalConfig)
  registerClientModules()
  registerModules(enabledModules, appContext)
  registerTheme(globalConfig.theme, app, routerProxy, store, globalConfig, ssrContext)

  coreHooksExecutors.afterAppInit()
  // @deprecated from 2.0
  EventBus.$emit('application-after-init', app)

  return { app, router: routerProxy, store, initialState: cloneDeep(store.state) }
}

export { routerProxy as router, createApp, router as baseRouter }
