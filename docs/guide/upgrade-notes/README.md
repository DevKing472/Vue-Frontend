# Upgrade notes

We're trying to keep the upgrade process as easy as possible. Unfortunately, sometimes manual code changes are required. Before pulling out the latest version, please take a look at the upgrade notes below:

## 1.8 -> 1.9
- The Url Dispatcher feature added for friendly URLs. When `config.seo.useUrlDispatcher` set to true the `product.url_path` and `category.url_path` fields are used as absolute URL addresses (no `/c` and `/p` prefixes anymore). Check the latest `mage2vuestorefront` snapshot and **reimport Your products** to properly set `url_path` fields 
- `cart.multisiteCommonCart` config property changed to `storeViews.commonCache`
- Way of creating VS Modules was changed to use factory method instead of explict object creation. Even though the feature is backward compatible we highly encourage all developers to refactor their modules to use new syntax.

The process of creating a new module with the factory method looks like the following:
````js
import { createModule } from '@vue-storefront/core/lib/module'

const moduleConfig: VueStorefrontModuleConfig = { 
  // VS module config 
}

const module = createModule(moduleConfig)
````
- `@vue-storefront/store` package has been depreciated. Just change imports to `@vue-storefront/core/store`.
- `breadCrumbRoutes` helper has been refactored to `formatBreadCrumbRoutes`
- orders which fail validation in API are assumed to have http code 400 instead of 500
- notification message about invalid order address now uses email configured in mailer section instead of hardcoded one
- Added validation for UTF8 alpha and alphanumeric characters in most checkout fields
- Update your local.json config and set default `api.url` path, without it you may have problems with elasticsearch queries.

## 1.7 -> 1.8
Full changelog is available [here](https://github.com/DivanteLtd/vue-storefront/blob/master/CHANGELOG.md)

- `store/types` have moved to new module named `core/types`.
- `store/lib/search` has been moved to `core/lib/search`.
- `store/lib/multistore.ts` has been [moved] to (https://github.com/patzick/vue-storefront/commit/d42cdc44fc204dd10b173894d52dbeff244913f5#diff-87917f882ffc57fb755b1cc82ffa9e28L11) to `core/lib/multistore.ts`
- new [styles](https://github.com/patzick/vue-storefront/commit/d42cdc44fc204dd10b173894d52dbeff244913f5#diff-ae72dc903f169eb56d716cd5ac99df35R1) file for form elements
- Removed unused `src/themes/default/filters/index.js` file. Check if you're not using it as well.
- `src/themes/default/resource/head.js` has been moved to `src/themes/default/head.js`
- `src/themes/default/index.basic.template.html` has been moved to `src/themes/default/templates/index.basic.template.html`
- `src/themes/default/index.minimal.template.html` has been moved to `src/themes/default/templates/index.minimal.template.html`
- `src/themes/default/index.template.html` has been moved to `src/themes/default/templates/index.template.html`

## 1.6 -> 1.7

Starting from Vue Storefront 1.7, we changed the caching strategy and offline-ready features:
- By default, the Elasticsearch Queries are executed using `GET` method and therefore are cached by Service Worker (`config.elasticsearch.queryMethod` — set it to POST for the previous behavior and if you're using graphql).
- By default, products and queries cache is set in `LocalStorage` with a quota set to 4MB (`config.server.elasticCacheQuota`). If the storage quota is set, the cache purging is executed every 30 seconds using the LRU algorithm. Local Storage is limited to 5MB in most browsers.
- We added `config.server. disableLocalStorageQueriesCache`, which is set to `true` by default. When this option is on, we're not storing the Elasticsearch results in the local cache because results are by default cached in the Service Worker cache anyway.
- `module.extend` has been changed to `extendModule`. You can find usage examples in `src/modules/index.ts`.
- [routes](https://github.com/patzick/vue-storefront/commit/a97eb11868de2915e86d57c4279caf944d4de422#diff-a334a7caeb7f61836f8c1178d92de3e0), [layouts](https://github.com/patzick/vue-storefront/commit/a97eb11868de2915e86d57c4279caf944d4de422#diff-48863b9fe31d7713222ec5709ef5a4fa), and component, which are not visible at page rendering are now loaded when they are needed.
- Every store manipulation should be done by dispatching actions. Invoke store dispatch on `category/mergeSearchOptions` when manipulating `store.state.category.current_product_query` somewhere.
- [here](https://github.com/patzick/vue-storefront/commit/a97eb11868de2915e86d57c4279caf944d4de422) are all changes in default themes

Backward compatibility: To reverse to the 1.0–1.6 behavior:
- Set `config.server.disableLocalStorageQueriesCache` = `false`,
- Set `config.elasticsearch.queryMethod` = `POST`
- Set `config.localForage.defaultDrivers.elasticCache` = `INDEXEDDB`

**NOTE:** Offline mode may not work properly in development mode (localhost) because of Service Workers and lack of bundle prefetching (bundles lazy loading).

With 1.7, the number of attribute descriptors that are loaded on the product page is limited and dynamically adjusted to the fields used in the product. This behavior shouldn't have any negative impact on your app; however, if you haven’t used the `attribute/list` action explicitly based on all attributes loaded by default (up to 1.6), this may cause problems. You can switch off the dynamic loader by setting the `config.entities.product.useDynamicAttributeLoader=false`. Details: [#2137](https://github.com/DivanteLtd/vue-storefront/pull/2137/files)

Dynamic Categories prefetching (#2076). Starting with Vue Storefront 1.7, we added a configuration option `config.entities.category.categoriesDynamicPrefetch` (by default set to `true`). TThis option switches the way the category tree is being fetched. Previously, we were fetching the full categories tree. In some cases, it can generate even a few MB of payload. Currently with this option in place, we're pre-fetching the categories on demand while the user is browsing the category tree.

**NOTE:** Since we're no longer generating `category.slug` client-side, we need to have `category.url_key` field unique. If Your Magento2 url_keys are unique it will work without any changes. If not - please do use [mage2vuestorefront](https://github.com/DivanteLtd/mage2vuestorefront) to re-import the categories. There is a new `categories` importer option `--generateUniqueUrlKeys` which is set to true by default.

With the new modules architecture available from 1.6 we've [updated the payment modules guide](https://github.com/DivanteLtd/vue-storefront/pull/2135). If You've used the custom payment (and basically any other) extensions please make sure You've already ported them to [new modules architecture](https://docs.vuestorefront.io/guide/modules/introduction.html).


## 1.5 -> 1.6

With 1.6, we introduced new modular architecture and moved most of the theme-specific logic from the core to the default theme. It's probably the biggest update in VS history and the first step to making future upgrades more seamless.

Due to architectural changes, `core/components` and `core/store/modules` folders were removed and reorganised into modules ( `core/modules`). In most cases, the components API remained the same (if not, we provided an API bridge in `core/compatibility/components` folder which allows you to benefit from new features without making changes in your theme). It's a good idea to look for imports referring to deleted folders after migration to be sure that we made a full update.

Overall, the theme upgrade for the default theme requires 105 files to be changed, but 85% of these changes are just a new import paths for the core component, which makes this update time-consuming, but easy to follow and not risky.

[Here](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f) you can find detailed information (as an upgrade commit with notes) about what needs to be changed in the theme to support VS 1.6.

#### Global changes
- Notifications are now based on Vuex Store instead of Event Bus. We also pulled hardcoded notifications from core to theme.

Change every component:
````js
this.$bus.$emit('notification',
````
to:
````js
this.$store.dispatch('notification/spawnNotification',
````
Change every store:
````js
Vue.prototype.$bus.$emit('notification',
````
to:
````js
rootStore.dispatch('notification/spawnNotification',
````
and make sure you are importing `rootStore`.

- Lazy loading for non-SSR routes is now available.

You can now [use dynamic imports to lazy load non-SSR routes](https://router.vuejs.org/guide/advanced/lazy-loading.html). You can find examples from the default theme [here](https://github.com/DivanteLtd/vue-storefront/tree/develop/src/themes/default/router)

- Extensions are now rewritten to modules (and the extensions system will be depreciated in 1.7).

If you haven't modified any extensions directly, you don't need to change anything. If you made such changes, you probably need to rewrite your extension to a module.

- The old event bus is moved to the compatibility folder. From now we are trying to create new features without it and slowly depreciate the event bus whenever possible. It'll be replaced with some enhanced module-based mechanism with event autosuggestion support.

Change all `@vue-storefront/core/plugins/event-bus` imports to `@vue-storefront/core/compatibility/plugins/event-bus`

#### Components that were moved or the API was changed and the compatibility component was created.

Required action: Change the import path. In case of additional changes click on a component name to see how to update.

- [`AddToCart.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-16a4dd1cbf1aaf74e001e6541fb27725)
- [`Breadcrumbs.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-fa33732560b7c39ea7854f701c4187bf)
- [`ColorSelector.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-551ae89c6d9e297a662749ee02676d45)
- [`GenericSelector.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-cbd08cdda068c587e3146bb3441e2161)
- [`NewsletterPopup.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-7b6cae3e664a647ff7397d6692e61cd6)
- [`Notification.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-d91127b094ff36e25dd94834c3aded6a) + `exec` changed to `execAction`, added `execAction`
- [`Overlay.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-66a3ae90ace32b95ebe4513c496f76ce)
- [`PriceSelector.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-f564bd3cf6c2687c23c442d1363fe97b)
- [`ProductAttribute.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-b9783243d8666d5b2e46df608e6ace48)
- [`ProductCustomOptions.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-14db476c8821b640e674f1e655340de5)
- [`ProductGallery.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-66a4dfcf61217934307df12e9e3f14c6)
- [`SizeSelector.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-a83c265a63b7b594b5052ec61907cde1)
- [`SortBy.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-5dab270f8342facd10835e828e5d7509) + change from dropdown to select
- [`ValidationError.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-e80a538151f16af10b20efa810ae0bc3)
- [`Login.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-3ac818c5cd6c41a9c9d7a3acba41cdb5)
- [`Category/Sidebar.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-88e78ea0dd0f96c15c4a00d29922e44c) + added possibility to clear all filters
- [`CartSummary.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-bacd489920bede6d60bc9ce0b165e517)
- [`OrderReview.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-958fa5f4d0d271422146a86119bde82d) + notifications moved from core to theme
- [`Payment.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-878b5e4180d8f997d0b57a7dc5d28154)
- [`PersonalDetails.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-d8651354142bff547c667cdab2e87a9f)
- [`Checkout/Product.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-a08ecdd137cc1b32d02d458e3ae22079)
- [`Shipping.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-a83c265a63b7b594b5052ec61907cde1)
- [`AccountIcon.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-b25a4326cbb2102f3293084aefe6d4c8)
- [`CompareIcon.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-4180179a247fd8ebb816f4d8e94e6c5b)
- [`HamburgerIcon.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-39d690ab85a291546f5ebe1606250fb5)
- [`MicrocartIcon.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-ddcf89d0ca46b06824190f07c87f6031)
- [`Returnicon.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-68dfc0097a84464e2f8196d0948b4a03)
- [`WishlistIcon.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-fabd1714a4872a2bcf26619adbe0709c)
- [`Microcart.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-ffba5dcba1456c20f565e314790cd450)
- [`Microcart/Product.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-5715f58dacfe621ce8d056e382f1be8b)
- [`MyNewsletter.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-48b9d7ff2e2e8e6cf6965fd582e51957)
- [`MyOrder.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-a8dbaeacd2cf4fb6440959d7827372fa)
- [`MyOrders.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-4d60c889f1362249fc19756d60f8f9b1)
- [`MyProfile.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-677b7e3129afc1c974c3bd08069662c7)
- [`MyShippingDetails.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-5ed705e03a497368b98d9ce41ec378de)
- [`Related.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-c1703e08c80fcacd8135eeb6d707aa95) + `refreshList` method changed
- [`SearchPanel.gql.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-2020399a5c1abfc37c176bfcc5912293)
- [`SearchPanel.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-e2ff52db282530838ffce57893ed4a77)
- [`SidebarMenu.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-c341122656ef878fc532a5c34348a1ec) + bugfix (hide longer menus that are below currently active one), direct router link instead of event
- [`Wishlist/Product.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-7c0514d730223832fd2e1fae9d5f2068)
- [`Wishlist.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-8dc4f61d36ae2b2ffc2a4c4603e844b8)
- [`Collection.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-26a650b112a3b01efd1ff3a5c752aba1)
- [`CustomCmsPage.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-8e52fc16e52baec382994cc11445d222) (extension)
- [`Home.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-91bc0c9fe9fa95dd88900beff8975200)

#### Components that were moved from core to theme

Required action: Add moved content and remove core import. In case of additional changes, click on a component name to see how to update.

- [`Loader.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-a2791ef5c57fb2459362720b4a624e53)
- [`Modal.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-527c2bb9d04213a2aaf1aac75673bc71) + static content removed
- [`ProductLinks.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-9ccb222e8d3decebb067729ee935899a)
- [`ProductListing.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-000bc323621dca4883033c0e91f9125a)
- [`ProductTile.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-4049e5b38efd1a5d0215fd71e32136a3) + core import moved to module
- [`ProductSlider.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-624e75f15bdb9b2f7d5f417138c9f0ec)
- [`ForgotPass.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-e2fbfb707a274bea8b9f7af3e3c57032)
- [`Register.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-f5266afaec9d55f2fc93cf3b874b7288) + core import moved to module
- [`SignUp.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-df0c798d67a63c4eef4d3141393db5f9)
- [`BaseCheckbox.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-23e3b8989b402a011ee4cb3f985fa3ce)
- [`BaseInput.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-d209385c453bdf31b89bc51772bd2bda)
- [`BaseRadioButton.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-1493dcb05a06ce313807003d1774fa14)
- [`BaseSelect.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-c4c37e440fd8ec3deeacef085b48ed9f)
- [`BaseTextArea.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-0ea48ec8c1545db8cbdacfd348f8bf75)
- [`Header.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-5f4560c69df1a5f6d97f0b064b9b792f)
- [`MainSlider.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-19c964e13db826a1358f30839627986b)
- [`Reviews.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-d8861516b2c7dfc547b91e1066ca4755) + empty array instead of null, core import path changed
- [`Compare.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-0aa476fa2f0314806d4afd620c80be54)

#### Other
- [`ProductBundleOption.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-32809917812e7c8c4571be70a693d65b) - splitted single option from `ProductBundleOptions.vue` component.
- [`ProductBundleOptions.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-7ccee94c636406b1a82feddea3a7f520) - single option moved to separate component `ProductBundleOption.vue`, moved to module.
- [`ThankYouPage.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-84c29c5b22568c31b021dc864221563f) added order id display, order confirmation, pulled notifications from core and added mail confirmation
- [`main.scss`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-c65e47159738f3552a22f16ec5c5974f) removed duplicated flexbox grid
- [`index.template.html`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-bf0804a2329350f8e9d9071e40cf1429) (+ all other templates that you may have like minimal, basic etc), added ` output.appendHead(), renderStyles()`
- [`Category.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-eb709969add1ca4a266ac072cddde954) notifications moved to theme
- [`Checkout.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-1c6544c28d075f275812201fa42755de) notifications moved to theme
- [`MyAccount.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-bb873f532ed9a2efbb157af79a70e0f7) notifications moved to theme
- [`Product.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-174db65df8e0c43df20b73b5bf16881b) minor changes in attribute var names that may influence the markup, notifications moved to theme
- [`Static.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-a3a9b6eeeba4c915c1ea1aae1c489ecc) static pages are no longed using markdown files.

## 1.4 -> 1.5

### Modifications

#### New Modules API

With 1.5.0, we introduced a new, heavily refactored modules API. We tried to keep the old theme components backward compatible, so now you can view some "mock" components in the `/core/components` referencing to the `/modules/<module>/components` original. Please read [how modules work and are structured](../modules/introduction.md) to check if it implies any changes to your theme. Though it may seem like a lot of changes (a lot of files were added/removed/renamed), it should not impact your custom code.

#### New Newsletter module

The existing newsletter-integration module was pretty chaotic and messy. @filrak has rewritten it from scratch. If you've relied on existing newsletter module logic / events / etc., it could have affected your code (low probability).

#### Memory leaks fixed

We fixed SSR memory leaks with #1882. It should not affect your custom code, but if you've modified any SSR features, please make sure that everything still works just fine.

## 1.3 -> 1.4

### Modifications

#### GraphQL

We added GraphQL support. Please read more on the [GraphQL Action Plan](https://github.com/DivanteLtd/vue-storefront/blob/develop/doc/GraphQL%20Action%20Plan.md). Starting from this release, the **bodybuilder** package is **deprecated**. You should use the **SearchQuery** internal class that can be used against API and GraphQL endpoints. Read more on [how to query data](https://github.com/DivanteLtd/vue-storefront/blob/develop/doc/data/ElasticSearch%20Queries.md).

#### SSR: Advanced output and cache

This change does not involve any required actions to port the code, but please be aware that we're supporting [SSR Cache](https://github.com/DivanteLtd/vue-storefront/blob/develop/doc/SSR%20Cache.md) + [dynamic layout changes](https://github.com/DivanteLtd/vue-storefront/blob/develop/doc/Layouts%20and%20advanced%20output%20operations.md) etc. If you're using the modified version of the theme, you can hardly use these without updating `themes/YourTheme/App.vue` to the new format (check the default theme for details).

#### Reviews

We added Reviews support, however, Magento 2 is still lacking Reviews support in the REST API. To have reviews up and running, please add the https://github.com/DivanteLtd/magento2-review-api to your Magento 2 instance.

#### Microcart

1. We moved core functionalities of coupon codes to API modules:

   - **Coupon** computed value is now **appliedCoupon** ([read more](https://github.com/DivanteLtd/vue-storefront/blob/master/doc/api-modules/cart.md))
   - **removeCoupon** ([read more](https://github.com/DivanteLtd/vue-storefront/blob/master/doc/api-modules/cart.md))
   - **applyCoupon** ([read more](https://github.com/DivanteLtd/vue-storefront/blob/master/doc/api-modules/cart.md))
   - **totals** -> **cartTotals** ([read more](https://github.com/DivanteLtd/vue-storefront/blob/master/doc/api-modules/cart.md))
   - **shipping** -> **cartShipping** ([read more](https://github.com/DivanteLtd/vue-storefront/blob/master/doc/api-modules/cart.md))
   - **payment** -> **cartPayment** ([read more](https://github.com/DivanteLtd/vue-storefront/blob/master/doc/api-modules/cart.md))

2. We moved/renamed methods responsible for UI to the default theme:
   - **addDiscountCoupon** - toggle coupon form
   - **removeCoupon** -> **clearCoupon** - removing coupon by dispatch removeCoupon API method and toggle coupon form
   - **applyCoupon** -> **setCoupon** - submit coupon form by dispatch applyCoupon API method
   - **enterCoupon** - was removed, because @keyup="enterCoupon" we changed to @keyup.enter="setCoupon"
   
3. We moved $emit with notification about appliedCoupon and removedCoupon from Vuex store to the default theme. Now applyCoupon and removeCoupon returns promise, which you can handle by yourself.

4. We moved VueOfflineMixin and onEscapePress mixins to the theme component. The core component is clean from UI stuff now.

5. We've replaced one method `Microcart` - `cartTotals` -> `totals`

#### Assets

1. We removed the default assets from `core/assets`. From now on, we only use the assets from `your-theme/assets`.

#### Store

1. We moved the socialTiles Vuex store from the core to the theme, because it's specific to the theme.

#### i18n

1. We removed all the theme-specific translations for the core.

## 1.2 -> 1.3

### Changes

1. We removed event emit from client-entry.js with online status information. Instead, we are now using [vue-offline](https://github.com/filrak/vue-offline) mixin. [#1494](https://github.com/DivanteLtd/vue-storefront/issues/1494)
2. We removed the isOnline variable from Microcart.js. Instead, we are now using variables from [vue-offline](https://github.com/filrak/vue-offline) mixin. [#1494](https://github.com/DivanteLtd/vue-storefront/issues/1494)

### Upgrade step-by-step

#### `global.$VS` replaced with `rootStore` and `config` was moved to `rootStore.state.config`

To get access to rootStore, import it by

`import rootStore from '@vue-storefront/core/store'`

#### cms extenstion was renamed to extension-magento2-cms

Import of CmsData must be changed in `CustomCmsPage.vue` component to:

`import CmsData from '@vue-storefront/extension-magento2-cms/components/CmsData'`

## 1.1 -> 1.2 ([release notes](https://github.com/DivanteLtd/vue-storefront/releases/tag/v1.2.0))

There were no breaking-changes introduced. No special treatment needed 😃

## 1.0 -> 1.1 ([release notes](https://github.com/DivanteLtd/vue-storefront/releases/tag/v1.1.0))

### Modifications

#### Plugins registration simplified

Instead of exporting an object in `{theme}/plugins/index.js` just use `Vue.use(pugin)` directly in this file ( [docs](https://github.com/DivanteLtd/vue-storefront/blob/master/doc/Working%20with%20plugins.md) )

#### Microcart logic moved to API module (partially)

Starting from Microcart, we are moving most of the logic to core modules along with unit testing them. [Read more](https://github.com/DivanteLtd/vue-storefront/issues/1213).

Changes that happened in `Microcart.js` core component and `Microcart.vue` component from default theme:

- `closeMicrocart` renamed to `closeMicrocartExtend`
- `items` renamed to `productsInCart`
- `removeFromCart`method added to core Microcart

#### `theme/app-extend.js` removed

It was redundant.

#### `{theme}/service-worker-ext.js` moved to `{theme}/service-worker/index.js`

Now it mirrors `core/` folder structure, which is desired behaviour.

### vue-storefront-api docker support has been extended

We added the possibility to run the `vue-storefront-api` fully in Docker (previously, just the Elastic and Redis images were present in the `docker-compose.yml`. Please read the [README.md](https://github.com/DivanteLtd/vue-storefront-api) for more details.

**PLEASE NOTE:** We changed the structure of the `elasticsearch` section of the config files, moving `esIndexes` to `elasticsearch.indices` etc. There is an automatic migration that will update your config files automatically by running: `npm run migrate` in the `vue-storefront-api` folder.

### Default storage of the shopping carts and user data moved to localStorage

Currently, there is a config option to set up the default local storage configs: https://github.com/DivanteLtd/vue-storefront/blob/271a33fc6e712b978e10b91447b05529b6d04801/config/default.json#L148. If you like the previous behavior of storing the carts in the indexedDb, please change the config backend to `INDEXEDDB`.

### mage2vuestorefront improvements

A lot of improvements have been added to the [mage2vuestorefront](https://github.com/DivanteLtd/mage2vuestorefront) importer. importer. For example, fixed special_price sync. For such changes, please update [mage2vuestorefront](https://github.com/DivanteLtd/mage2vuestorefront) and re-import your products. We also added the dynamic on/demand indexing.

### New features

We added [`vue-progressbar`](https://github.com/hilongjw/vue-progressbar) to default theme, which can be found in `App.vue` file.

## 1.0RC-3 -> 1.0([release notes](https://github.com/DivanteLtd/vue-storefront/releases/tag/v1.0.0))

This is the official, stable release of Vue Storefront.

1. We renamed `the core/components/*.vue` -> `the core/components/*.js`
2. We renamed `the core/pages/*.vue` -> `the core/pages/*.js`
3. We removed `corePage` and `coreComponent` helpers and created an es-lint rule to migrate the `import` statements automatically (with `--fix` parameter)

You should replace the mixin declarations from the previous version:

```vue
<script>
import { coreComponent } from '@vue-storefront/core/lib/themes';

export default {
  mixins: [coreComponent('blocks/MyAccount/MyOrders')],
};
</script>
```

to

```vue
<script>
import MyOrders from '@vue-storefront/core/components/blocks/MyAccount/MyOrders';

export default {
  mixins: [MyOrders],
};
</script>
```

4. We've added Multistore support. It shouldn't imply any breaking changes to the existing themes / extensions (by default it's just disabled). 

## 1.0RC-2 -> 1.0RC-3 ([release notes](https://github.com/DivanteLtd/vue-storefront/releases/tag/v1.0.0-rc.3))

This release contains three important refactoring efforts:

1. We changed the user-account endpoints and added the token-reneval mechanism, which is configured by
`config.users.autoRefreshTokens`. If set to true and user token will expire, VS will try to refresh it.

2. We separated the user-account endpoints, so please copy the following defaults from `default.json` to Your `local.json` and set the correct API endpoints:

```json
    "users": {
      "autoRefreshTokens": true,
      "endpoint": "http://localhost:8080/api/user",
      "history_endpoint": "http://localhost:8080/api/user/order-history?token={{token}}",
      "resetPassword_endpoint": "http://localhost:8080/api/user/reset-password",
      "changePassword_endpoint": "http://localhost:8080/api/user/change-password?token={{token}}",
      "login_endpoint": "http://localhost:8080/api/user/login",
      "create_endpoint": "http://localhost:8080/api/user/create",
      "me_endpoint": "http://localhost:8080/api/user/me?token={{token}}",
      "refresh_endpoint": "http://localhost:8080/api/user/refresh"
    },
```

The endpoints are also set by the `yarn installer` so You can try to reinstall VS using this command.

3. We optimized the performance by limiting the fields loaded each time in JSON objects from the backend. Please review the `config/default.json`and if some fields required / used by your app are missing, copy the following fragment to the `config/local.json` and add the required fields:

```json
    "entities": {
      "optimize": true,
      "twoStageCaching": true,
      "category": {
        "includeFields": [ "children_data", "id", "children_count", "sku", "name", "is_active", "parent_id", "level" ]
      },
      "attribute": {
        "includeFields": [ "attribute_code", "id", "entity_type_id", "options", "default_value", "is_user_defined", "frontend_label", "attribute_id", "default_frontend_label", "is_visible_on_front", "is_visible", "is_comparable" ]
      },
      "productList": {
        "includeFields": [ "type_id", "sku", "name", "price", "priceInclTax", "originalPriceInclTax", "id", "image", "sale", "new" ],
        "excludeFields": [ "configurable_children", "description", "configurable_options", "sgn", "tax_class_id" ]
      },
      "productListWithChildren": {
        "includeFields": [ "type_id", "sku", "name", "price", "priceInclTax", "originalPriceInclTax", "id", "image", "sale", "new", "configurable_children.image", "configurable_children.sku", "configurable_children.price", "configurable_children.special_price", "configurable_children.priceInclTax", "configurable_children.specialPriceInclTax", "configurable_children.originalPrice", "configurable_children.originalPriceInclTax", "configurable_children.color", "configurable_children.size" ],
        "excludeFields": [ "description", "sgn", "tax_class_id" ]
      },
      "product": {
        "excludeFields": [ "updated_at", "created_at", "attribute_set_id", "status", "visibility", "tier_prices", "options_container", "url_key", "msrp_display_actual_price_type", "has_options", "stock.manage_stock", "stock.use_config_min_qty", "stock.use_config_notify_stock_qty", "stock.stock_id",  "stock.use_config_backorders", "stock.use_config_enable_qty_inc", "stock.enable_qty_increments", "stock.use_config_manage_stock", "stock.use_config_min_sale_qty", "stock.notify_stock_qty", "stock.use_config_max_sale_qty", "stock.use_config_max_sale_qty", "stock.qty_increments", "small_image"],
        "includeFields": null
      }
    },
```

If `optimize` is set to false, it's a fallback to the previous behaviour (getting all fields).

4. Another cool feature is `twoStageCaching` enabled by default. It means that for the Category page, VS is getting only the minimum number of JSON fields required to display the ProductTiles. Shortly after, it downloads the full objects by the second request to store them in the local cache.

5. We tweaked the Service Worker to better cache the app; it sometimes can generate frustration if your home page is now cached in the SW (previously was not). Feel free to use `Clear Storage` in your Developers tools :)

6. The `mage2vuestorefront` tool got update and now it's loading the `media_gallery` with additional media per product. We also put some MediaGallery components on the product page.

7.Product and Category pages got refactored. It's a massive refactoring moving all the logic to the Vuex stores, so if you played with the core `fetchData`/`loadData` functions, your code may be affected by this change.

## 1.0RC -> 1.0RC-2 ([release notes](https://github.com/DivanteLtd/vue-storefront/releases/tag/v1.0.0-rc.2))

This release brings some cool new features (Magento 1.x support, Magento 2 external checkout, My Orders, Discount Codes) together with some minor refactors.

Unfortunately, with the refactors comes two manual changes that need to be applied to your custom themes after the update.

Here You can check an **[example how did we migrated our own default_m1 theme to RC-2](https://github.com/DivanteLtd/vue-storefront/commit/111519c04acec272657e7eefec7ea8405da95f13)**.

1. We changed `ColorButton`, `SizeButton`, `PriceButton` in the `core` to `ColorSelector`, `SizeSelector`, `PriceSelector` and added the `GenericSelector` for all other attribute types. Because of this change, the `coreComponent('ColorButton')` must be changed to `coreComponent('ColorSelector')` etc.

2. We added the Vuex Stores extensibility to the themes. If You're getting the following build error:

```
ERROR in ./core/store/index.js
Module not found: Error: Can't resolve 'theme/store' in '***/vue-storefront/core/store'
```

It means, that you need to copy the template store to: `<Your custom theme folder>/store`.
