import { VueStorefrontModule, VueStorefrontModuleConfig } from '@vue-storefront/module'
import { module } from './store'

const KEY = 'promoted'

const moduleConfig: VueStorefrontModuleConfig = {
  key: KEY,
  store: { modules: [{ key: KEY, module }] }
}

export const PromotedOffers = new VueStorefrontModule(moduleConfig)