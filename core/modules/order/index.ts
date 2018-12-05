import { VueStorefrontModuleConfig, VueStorefrontModule } from '@vue-storefront/core/lib/module'
import { module } from './store'

export const KEY = 'order'

const moduleConfig: VueStorefrontModuleConfig = {
  key: KEY,
  store: { modules: [{ key: KEY, module }] },
}

export const Order = new VueStorefrontModule(moduleConfig)