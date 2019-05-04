// import router from '@vue-storefront/core/router'
// uncomment if you want to modify the router e.g. add before/after hooks
import Category from '../pages/Category.vue'
import Product from '../pages/Product.vue'
import { RouteConfig } from 'vue-router'

import config from 'config'

let routes: RouteConfig[] = [
]
if (!config.products.useShortCatalogUrls) {
  routes = routes.concat([{ name: 'virtual-product-amp', path: '/amp/p/:parentSku/:slug', component: Product, meta: { layout: 'minimal' } }, // :sku param can be marked as optional with ":sku?" (https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js#L16), but it requires a lot of work to adjust the rest of the site
    { name: 'bundle-product-amp', path: '/amp/p/:parentSku/:slug', component: Product, meta: { layout: 'minimal' } }, // :sku param can be marked as optional with ":sku?" (https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js#L16), but it requires a lot of work to adjust the rest of the site
    { name: 'simple-product-amp', path: '/amp/p/:parentSku/:slug', component: Product, meta: { layout: 'minimal' } }, // :sku param can be marked as optional with ":sku?" (https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js#L16), but it requires a lot of work to adjust the rest of the site
    { name: 'downloadable-product-amp', path: '/amp/p/:parentSku/:slug', component: Product, meta: { layout: 'minimal' } }, // :sku param can be marked as optional with ":sku?" (https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js#L16), but it requires a lot of work to adjust the rest of the site
    { name: 'grouped-product-amp', path: '/amp/p/:parentSku/:slug', component: Product, meta: { layout: 'minimal' } }, // :sku param can be marked as optional with ":sku?" (https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js#L16), but it requires a lot of work to adjust the rest of the site
    { name: 'configurable-product-amp', path: '/amp/p/:parentSku/:slug/:childSku', component: Product, meta: { layout: 'minimal' } }, // :sku param can be marked as optional with ":sku?" (https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js#L16), but it requires a lot of work to adjust the rest of the site
    { name: 'product-amp', path: '/amp/p/:parentSku/:slug/:childSku', component: Product, meta: { layout: 'minimal' } }, // :sku param can be marked as optional with ":sku?" (https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js#L16), but it requires a lot of work to adjust the rest of the site
    { name: 'category-amp', path: '/amp/c/:slug', component: Category }])
} else {
  routes = routes.concat([{ name: 'virtual-product-amp', path: '/amp/:parentSku/:slug', component: Product, meta: { layout: 'minimal' } }, // :sku param can be marked as optional with ":sku?" (https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js#L16), but it requires a lot of work to adjust the rest of the site
    { name: 'bundle-product-amp', path: '/amp/:parentSku/:slug', component: Product, meta: { layout: 'minimal' } }, // :sku param can be marked as optional with ":sku?" (https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js#L16), but it requires a lot of work to adjust the rest of the site
    { name: 'simple-product-amp', path: '/amp/:parentSku/:slug', component: Product, meta: { layout: 'minimal' } }, // :sku param can be marked as optional with ":sku?" (https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js#L16), but it requires a lot of work to adjust the rest of the site
    { name: 'downloadable-product-amp', path: '/amp/:parentSku/:slug', component: Product, meta: { layout: 'minimal' } }, // :sku param can be marked as optional with ":sku?" (https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js#L16), but it requires a lot of work to adjust the rest of the site
    { name: 'grouped-product-amp', path: '/amp/:parentSku/:slug', component: Product, meta: { layout: 'minimal' } }, // :sku param can be marked as optional with ":sku?" (https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js#L16), but it requires a lot of work to adjust the rest of the site
    { name: 'configurable-product-amp', path: '/amp/:parentSku/:slug/:childSku', component: Product, meta: { layout: 'minimal' } }, // :sku param can be marked as optional with ":sku?" (https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js#L16), but it requires a lot of work to adjust the rest of the site
    { name: 'product-amp', path: '/amp/:parentSku/:slug/:childSku', component: Product, meta: { layout: 'minimal' } }, // :sku param can be marked as optional with ":sku?" (https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js#L16), but it requires a lot of work to adjust the rest of the site
    { name: 'category-amp', path: '/amp/:slug', component: Category, meta: { layout: 'minimal' } }])
}
export default routes
