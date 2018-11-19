import { VueStorefrontModule, VueStorefrontModuleConfig } from '@vue-storefront/module'
import { beforeRegistration } from './hooks/beforeRegistration'
import { afterRegistration } from './hooks/afterRegistration'

const store = {
  namespaced: true,
  state: {
    key: null
  }
}

const KEY = 'google-analytics'

const moduleConfig: VueStorefrontModuleConfig = {
  key: KEY,
  store: { modules: [{ key: KEY, module: store }] },
  beforeRegistration,
  afterRegistration
}

export const GoogleAnalytics = new VueStorefrontModule(moduleConfig)