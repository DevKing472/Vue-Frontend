// import { extendModule } from '@vue-storefront/core/lib/module'
import { VueStorefrontModule } from '@vue-storefront/core/lib/module'
import { CatalogModule } from '@vue-storefront/core/modules/catalog'
import CatalogNext from '@vue-storefront/core/modules/catalog-next'
import { CartModule } from '@vue-storefront/core/modules/cart'
import { CheckoutModule } from '@vue-storefront/core/modules/checkout'
import { Compare } from '@vue-storefront/core/modules/compare'
import { Review } from '@vue-storefront/core/modules/review'
import { Mailer } from '@vue-storefront/core/modules/mailer'
import { Wishlist } from '@vue-storefront/core/modules/wishlist'
import { Newsletter } from '@vue-storefront/core/modules/newsletter'
import { Notification } from '@vue-storefront/core/modules/notification'
import { RecentlyViewed } from '@vue-storefront/core/modules/recently-viewed'
import { Url } from '@vue-storefront/core/modules/url'
import { Homepage } from './homepage'
import { Claims } from './claims'
import { PromotedOffers } from './promoted-offers'
import { Ui } from './ui-store'
// import { GoogleAnalytics } from './google-analytics';
// import { Hotjar } from './hotjar';
import { googleTagManager } from './google-tag-manager';
import { AmpRenderer } from './amp-renderer';
import { PaymentBackendMethods } from './payment-backend-methods';
import { PaymentCashOnDelivery } from './payment-cash-on-delivery';
import { RawOutputExample } from './raw-output-example'
import { InstantCheckout } from './instant-checkout'
import { OrderHistory } from './order-history'
// import { Example } from './module-template'
import { registerModule } from '@vue-storefront/module'

// TODO:distributed across proper pages BEFORE 1.11
export function registerNewModules () {
  registerModule(CatalogModule)
  registerModule(CheckoutModule)
  registerModule(CartModule)
}

// Deprecated API, will be removed in 2.0
export const registerModules: VueStorefrontModule[] = [
  Compare,
  Review,
  Mailer,
  Wishlist,
  Newsletter,
  Notification,
  Ui,
  RecentlyViewed,
  Homepage,
  Claims,
  PromotedOffers,
  googleTagManager,
  // GoogleAnalytics,
  // Hotjar,
  PaymentBackendMethods,
  PaymentCashOnDelivery,
  RawOutputExample,
  AmpRenderer,
  InstantCheckout,
  Url,
  CatalogNext,
  OrderHistory
  // Example
]
