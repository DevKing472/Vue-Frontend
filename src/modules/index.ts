// import { extendModule } from '@vue-storefront/core/lib/module'
import { VueStorefrontModule } from '@vue-storefront/core/lib/module'
import { Catalog } from "@vue-storefront/core/modules/catalog"
import { Cart } from '@vue-storefront/core/modules/cart'
import { Checkout } from '@vue-storefront/core/modules/checkout'
import { Compare } from '@vue-storefront/core/modules/compare'
import { Review } from '@vue-storefront/core/modules/review'
import { Mailer } from '@vue-storefront/core/modules/mailer'
import { Wishlist } from '@vue-storefront/core/modules/wishlist'
import { Mailchimp } from '../modules/mailchimp'
import { Notification } from '@vue-storefront/core/modules/notification'
import { RecentlyViewed } from '@vue-storefront/core/modules/recently-viewed'
import { Homepage } from "./homepage"
import { Claims } from './claims'
import { PromotedOffers } from './promoted-offers'
import { Ui } from './ui-store'
// import { GoogleAnalytics } from './google-analytics';
// import { Hotjar } from './hotjar';
import { AmpRenderer } from './amp-renderer';
import { PaymentBackendMethods } from './payment-backend-methods';
import { PaymentCashOnDelivery } from './payment-cash-on-delivery';
import { RawOutputExample } from './raw-output-example'
import { Magento2CMS } from './magento-2-cms'
// import { Example } from './module-template'

// This is how you can extend any of VS modues
// const extendCartVuex = {
//   actions: {
//     load () {
//       Logger.info('New load function')()
//     }
//   }
//  }

//  const cartExtend = {
//   key: 'cart',
//   afterRegistration: function(isServer, config) {
//     Logger.info('New afterRegistration hook')()
//   },
//   store: { modules: [{ key: 'cart', module: extendCartVuex }] },
//  }

//  extendModule(cartExtend)

/**
 * Some of the modules are registered lazily only when components from module are appearing on current page.
 * If you want to use this modules in pages without it's components you need to remember about registering module first
 * In VS 1.8 this modules will be semlessly lazyLoaded after proper action dispatch
 * - Wishlist
 */
export const registerModules: VueStorefrontModule[] = [
  Checkout,
  Catalog,
  Cart,
  Compare,
  Review,
  Mailer,
  Wishlist,
  Mailchimp,
  Notification,
  Ui,
  RecentlyViewed,
  Homepage,
  Claims,
  PromotedOffers,
  Magento2CMS,
  // GoogleAnalytics,
  // Hotjar,
  PaymentBackendMethods,
  PaymentCashOnDelivery,
  RawOutputExample,
  AmpRenderer/*,
  Example*/
]
