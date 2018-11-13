import { VueStorefrontModule } from '@vue-storefront/module'
import { module } from './store'

const KEY = 'claims'

export const Claims = new VueStorefrontModule({
  key: KEY,
  store: { modules: [{ key: KEY, module }]}
}) 