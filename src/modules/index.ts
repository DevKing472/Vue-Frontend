import { VueStorefrontModule } from '@vue-storefront/module'
import { Category } from '@vue-storefront/core/modules/category'
import { Product } from "@vue-storefront/core/modules/product"
import { Cart } from '@vue-storefront/core/modules/cart'
import { Compare } from '@vue-storefront/core/modules/compare'
import { Review } from '@vue-storefront/core/modules/review'
import { Mailer } from '@vue-storefront/core/modules/mailer'
import { Mailchimp } from '../modules/mailchimp'
import { Example } from '@vue-storefront/core/modules/module-template'
import { Notification } from '@vue-storefront/core/modules/notification'
import { RecentlyViewed } from '@vue-storefront/core/modules/recently-viewed'
import { Homepage } from "./homepage"
// Some modules  that still needs API refactoring are  temporary registered in core
// This is how you can adjust any module with application-specific behavior
const extendedExample = new VueStorefrontModule({
  key: 'extend',
  afterRegistration: function(Vue, config) {
    console.info('Hello, im extended now!')
  }
})

Example.extend(extendedExample)

export const registerModules: VueStorefrontModule[] = [
  Category,
  Product,
  Cart,
  Compare,
  Review,
  Mailer,
  Mailchimp,
  Notification,
  RecentlyViewed,
  Homepage
  // Example
]
