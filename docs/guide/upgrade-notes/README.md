# Upgrade notes

We're trying to keep the upgrade process as easy as it's possible. Unfortunately, sometimes manual code changes are required. Before pulling out the latest version, please take a look at the upgrade notes below:
## 1.5 -> 1.6

With 1.6 we've introduced new modular architecture and moved most of theme-specific logic from core to default theme. It's probably the biggest update in VS history and the first step to making future upgrades more and more seamless.

Due to architectural changes `core/components` and `core/store/modules` folders were removed and reorganised into modules ( `core/modules`). In most cases, the components API remained the same (if not we provided an API bridge in `core/compatibility/components` folder which allows you to benefit from new features without making changes in your theme). It's a good idea to look for imports referring to deleted folders after migration to be sure that we made a full update.

Overall theme upgrade for default theme requires 105 files to be changed but 85% of this changes is just a new import path for core component which makes this update time-consuming but easy to follow and not risky.

[Here](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f) you can find detailed information (as a upgrade commit with notes) about what needs to be changed in theme to support VS 1.6.

#### Global changes
- Notifications are now based on Vuex Store instead of Event Bus. We've also pulled hardcoded notifications from core to theme

Change in every component:
````js
this.$bus.$emit('notification',
````
to:
````js
this.$store.dispatch('notification/spawnNotification',
````
Change in every store:
````js
Vue.prototype.$bus.$emit('notification',
````
to:
````js
rootStore.dispatch('notification/spawnNotification',
````
and make sure you are importing `rootStore`.
- Lazy loading for non-SSR routes is now available

You can now [use dynamic imports to lazy load non-SSR routes](https://router.vuejs.org/guide/advanced/lazy-loading.html). You can find examples from default theme [here](https://github.com/DivanteLtd/vue-storefront/tree/develop/src/themes/default/router)

- Extensions are now rewritten to modules (and extensions system will be deprecated in 1.7).

If you haven't modified any extensions directly you don't need to change anything. If you made such changes you'd probably need to rewrite your extension to a module.

- Old event bus is moved to the compatibility folder. From now we are trying to create new features without it and slowly depreciate event bus whenever it's possible. It'll be replaced with some enhanced module-based mechanism with event autosuggestion support.

change all `@vue-storefront/core/plugins/event-bus` imports to `@vue-storefront/core/compatibility/plugins/event-bus`

#### Components that were moved or API was changed and the compatibility component was created.

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

Required action: Add moved content and remove core import. In case of additional changes click on a component name to see how to update.

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
- [`index.template.html`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-bf0804a2329350f8e9d9071e40cf1429) (+ all other templates that you may have like minimal, basic etc), added output.appendHead(), renderStyles()    
- [`Category.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-eb709969add1ca4a266ac072cddde954) notifications moved to theme
- [`Checkout.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-1c6544c28d075f275812201fa42755de) notifications moved to theme
- [`MyAccount.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-bb873f532ed9a2efbb157af79a70e0f7) notifications moved to theme
- [`Product.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-174db65df8e0c43df20b73b5bf16881b) minor changes in attribute var names that may influence the markup, notifications moved to theme
- [`Static.vue`](https://github.com/DivanteLtd/vue-storefront/commit/cc17b5bfa43a9510815aea14dce8bafac382bc7f#diff-a3a9b6eeeba4c915c1ea1aae1c489ecc) Static pages are no longed using markdown files.

## 1.4 -> 1.5

### Modifications

#### New Modules API

With 1.5.0 we've introduced new heavily refactored modules API. We've tried to keep the old theme components backward compatible - so now You can few some "mock" components in the `/core/components` just referencing to the `/modules/<module>/components` original. Please read [how modules work and are structured](../modules/introduction.md) to check if it's implies any changes to Your theme. As it may seem like massive changes (lot of files added/removed/renamed) - It should not impact Your custom code.

#### New Newsletter module

The existing newsletter integration module was pretty chaotic and messy. @filrak has rewritten it from scratch. If You've relied on existing newsletter module logic / events / etc. it could have affected Your code (low probability).

#### Memory leaks fixed

We've fixed SSR memory leaks with #1882. It should not affect Your custom code - but if You've modified any SSR features please just make sure that everything still works just fine.

## 1.3 -> 1.4

### Modifications

#### GraphQL

We've added GraphQL support. Please read more on the [GraphQL Action Plan](https://github.com/DivanteLtd/vue-storefront/blob/develop/doc/GraphQL%20Action%20Plan.md). Starting from this release **bodybuilder** package is **deprecated**. You should use **SearchQuery** internal class that can be used against API and GraphQL endpoints. Read more on [how to query data](https://github.com/DivanteLtd/vue-storefront/blob/develop/doc/data/ElasticSearch%20Queries.md).

#### SSR - Advanced output + cache

However, this change is not involving any required actions to port the code but please just be aware that we're supporting [SSR Cache](https://github.com/DivanteLtd/vue-storefront/blob/develop/doc/SSR%20Cache.md) + [dynamic layout changes](https://github.com/DivanteLtd/vue-storefront/blob/develop/doc/Layouts%20and%20advanced%20output%20operations.md) etc. If You're using modified version of the theme - You can hardly use these without updating `themes/YourTheme/App.vue` to the new format (check the default theme for details).

#### Reviews

We've added the Reviews support, however, Magento2 is still lacking Reviews support in the REST API. To have reviews up and running please add the https://github.com/DivanteLtd/magento2-review-api to Your Magento2 instance.

#### Microcart

1. We moved core functionalities of coupon codes to API modules:

   - **coupon** computed value is now **appliedCoupon** ([read more](https://github.com/DivanteLtd/vue-storefront/blob/master/doc/api-modules/cart.md))
   - **removeCoupon** ([read more](https://github.com/DivanteLtd/vue-storefront/blob/master/doc/api-modules/cart.md))
   - **applyCoupon** ([read more](https://github.com/DivanteLtd/vue-storefront/blob/master/doc/api-modules/cart.md))
   - **totals** -> **cartTotals** ([read more](https://github.com/DivanteLtd/vue-storefront/blob/master/doc/api-modules/cart.md))
   - **shipping** -> **cartShipping** ([read more](https://github.com/DivanteLtd/vue-storefront/blob/master/doc/api-modules/cart.md))
   - **payment** -> **cartPayment** ([read more](https://github.com/DivanteLtd/vue-storefront/blob/master/doc/api-modules/cart.md))

2. We moved/renamed methods responsible for UI to default theme:
   - **addDiscountCoupon** - toggle coupon form
   - **removeCoupon** -> **clearCoupon** - removing coupon by dispatch removeCoupon API method and toggle coupon form
   - **applyCoupon** -> **setCoupon** - submit coupon form by dispatch applyCoupon API method
   - **enterCoupon** - was removed, because @keyup="enterCoupon" we changed to @keyup.enter="setCoupon"
3. We moved \$emit with notification about appliedCoupon and removedCoupon from vuex store to default theme. Now applyCoupon and removeCoupon returns promise which you can handle by ourself.
4. We moved VueOfflineMixin and onEscapePress mixins to theme component. Core component is clean from UI stuff now.
5. We've replaced one method `Microcart` - `cartTotals` -> `totals`

#### Assets

1. We removed the default assets from `core/assets`. From now on, we only use the assets from `your-theme/assets`.

#### Store

1. We moved the socialTiles Vuex store from the core to the theme, because it's specific to the theme.

#### i18n

1. We removed all the theme specific translations for the core.

## 1.2 -> 1.3

### Changes

1. We've removed event emit from client-entry.js with online status information. Instead of this, we are using now [vue-offline](https://github.com/filrak/vue-offline) mixin. [#1494](https://github.com/DivanteLtd/vue-storefront/issues/1494)
2. We've removed isOnline variable from Microcart.js, instead of this, we are using now variables from [vue-offline](https://github.com/filrak/vue-offline) mixin. [#1494](https://github.com/DivanteLtd/vue-storefront/issues/1494)

### Upgrade step by step

#### `global.$VS` replaced with `rootStore` and `config` was moved to `rootStore.state.config`

To get access to rootStore import it by

`import rootStore from '@vue-storefront/store'`

#### cms extenstion was renamed to extension-magento2-cms

Import of CmsData must be changed in `CustomCmsPage.vue` component to:

`import CmsData from '@vue-storefront/extension-magento2-cms/components/CmsData'`

## 1.1 -> 1.2 ([release notes](https://github.com/DivanteLtd/vue-storefront/releases/tag/v1.2.0))

There were no breaking-changes introduced. No special treatment needed :)

## 1.0 -> 1.1 ([release notes](https://github.com/DivanteLtd/vue-storefront/releases/tag/v1.1.0))

### Modifications

#### Plugins registration simplified

Instead of exporting an object in `{theme}/plugins/index.js` just use `Vue.use(pugin)` directly in this file ( [docs](https://github.com/DivanteLtd/vue-storefront/blob/master/doc/Working%20with%20plugins.md) )

#### Microcart logic moved to API module (partially)

Starting from the Microcart we are moving most of the logic to core modules along with unit testing them [read more](https://github.com/DivanteLtd/vue-storefront/issues/1213).

Changes that happened in `Microcart.js` core component and `Microcart.vue` component from default theme

- `closeMicrocart` renamed to `closeMicrocartExtend`
- `items` renamed to `productsInCart`
- `removeFromCart`method added to core Microcart

#### `theme/app-extend.js` removed

It was redundant

#### `{theme}/service-worker-ext.js` moved to `{theme}/service-worker/index.js`

Now it mirrors `core/` folder structure which is desired behaviour

### vue-storefront-api docker support has been extended

We've added the possibility to run the `vue-storefront-api` fully in docker (previously just the Elastic and Redis images were present in the `docker-compose.yml`. Please read the [README.md](https://github.com/DivanteLtd/vue-storefront-api) for more details.

**PLEASE NOTE:** We've changed the structure of the `elasticsearch` section of the config files, moving `esIndexes` to `elasticsearch.indices` etc. There is an automatic migration that will update Your config files automatically by running: `npm run migrate` in the `vue-storefront-api` folder.

### Default storage of the shopping carts and user data moved to localStorage

Currently, there is an config option to setup the default local storage configs: https://github.com/DivanteLtd/vue-storefront/blob/271a33fc6e712b978e10b91447b05529b6d04801/config/default.json#L148. If You like the previous behaviour of storing the carts in the indexedDb - please change the config backend to `INDEXEDDB`.

### mage2vuestorefront improvements

However non-breaking changes - lot of improvements have been added to the [mage2vuestorefront](https://github.com/DivanteLtd/mage2vuestorefront) importer. For example - fixed special_price sync. For such a changes - please update [mage2vuestorefront](https://github.com/DivanteLtd/mage2vuestorefront) and re-import Your products. We've also added the dynamic on/demand indexing.

### New features

We added [`vue-progressbar`](https://github.com/hilongjw/vue-progressbar) to default theme which can be found in `App.vue` file

## 1.0RC-3 -> 1.0([release notes](https://github.com/DivanteLtd/vue-storefront/releases/tag/v1.0.0))

This is official, stable release of Vue Storefront.

1. We've renamed `the core/components/*.vue` -> `the core/components/*.js`
2. We've renamed `the core/pages/*.vue` -> `the core/pages/*.js`
3. We've removed `corePage` and `coreComponent` helpers and created an es-lint rule to migrate the `import` statements automatically (with `--fix` parameter)

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

4. We've added Multistore support. It shouldn't imply any breaking changes to the existing themes / extensions (by default it's just disabled). More info on that: <a href="https://github.com/DivanteLtd/vue-storefront/blob/master/doc/Multistore%20setup.md">How to setup Multistore mode</a>.

## 1.0RC-2 -> 1.0RC-3 ([release notes](https://github.com/DivanteLtd/vue-storefront/releases/tag/v1.0.0-rc.3))

This release contains three important refactoring efforts:

1. We've changed the user-account endpoints and added the token-reneval mechanism which is configured by `config.users.autoRefreshTokens`; if set to true and user token will expire - VS will try to refresh it.

2. Moreover, we've separated the user-account entpoints - so please copy the following defaults from `default.json` to Your `local.json` and set the correct api endpoints:

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

3. We've optimized the performance by limiting the fields loaded each time in JSON objects from the backend. Please review the `config/default.json` and if some required / used by Your app fields are missing there - please copy the following fragment to the `config/local.json` and add the required fields:

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

If `optimize` is set to false - it's a fallback to the previous behaviour (getting all fields).

4. Another cool feature is `twoStageCaching` enabled by default. It means that for the Category page VS is getting only the minimum number of JSON fields required to display the ProductTiles and shortly after it downloads by the second request the full objects to store them in local cache.

5. We've tweaked the Service Worker to better cache the app - it sometimes can generate kind of frustration if your home page is now cached in the SW (previously was not). Feel free to use `Clear Storage` in Your Developers tools :)

6. The `mage2vuestorefront` tool got update and now it's loading the `media_gallery` with additional media per product. We've also put some MediaGallery component on the product page.

7. Product and Category pages got refactored - and it's a massive refactoring moving all the logic to the Vuex stores. So If You played with the core - `fetchData`/`loadData` functions probably Your code will be affected by this change.

## 1.0RC -> 1.0RC-2 ([release notes](https://github.com/DivanteLtd/vue-storefront/releases/tag/v1.0.0-rc.2))

This release brings some cool new features (Magento 1.x support, Magento 2 external checkout, My Orders, Discount codes) together with some minor refactors.

Unfortunately with the refactors there comes two manual changes that need to be applied to Your custom themes after the update.

Here You can check an **[example how did we migrated our own default_m1 theme to RC-2](https://github.com/DivanteLtd/vue-storefront/commit/111519c04acec272657e7eefec7ea8405da95f13)**.

1. We've changed `ColorButton`, `SizeButton`, `PriceButton` in the `core` to `ColorSelector`, `SizeSelector`, `PriceSelector` and added the `GenericSelector` for all other attribute types. Because of this change, the `coreComponent('ColorButton')` must be changed to `coreComponent('ColorSelector')` etc.

2. We added the Vuex Stores extensibility to the themes. If You're getting the following build error:

```
ERROR in ./core/store/index.js
Module not found: Error: Can't resolve 'theme/store' in '***/vue-storefront/core/store'
```

It means, that You need to copy the [template store](https://github.com/DivanteLtd/vue-storefront/blob/master/src/themes/default/store/index.js) to: `<Your custom theme folder>/store`.
