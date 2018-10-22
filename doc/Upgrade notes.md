# Upgrade notes

We're trying to keep the upgrade process as easy as it's possible. Unfortunately sometimes manual code changes are required. Before pulling out the latest version, please take a look at the upgrade notes below:.

## 1.4 -> 1.5

### Modifications

#### New Modules API

With 1.5.0 we've introduced new hevily refactored modules API. We've tried to keep the old theme components backward compatible - so now You can few some "mock" components in the `/core/components` just referencing to the `/modules/{{module}}/components` original. Please read [how modules work and are structured](https://github.com/DivanteLtd/vue-storefront/blob/master/doc/api-modules/about-modules.md) to check if it's implies any changes to Your theme. As it may seem like massive changes (lot of files added/removed/renamed) - It should not impact Your custom code. 

#### New Newsletter module

The exsiting newsletter integration module was pretty chaotic and messy. @filrak has rewritten it from scratch. If You've relied on exisitng newsletter module logic / events / etc. it could have affected Your code (low probability).

#### Memory leaks fixed

We've fixed SSR memory leaks with #1882. It should not affect Your custom code - but if You've modified any SSR features please just make sure that everything still works just fine. 

## 1.3 -> 1.4

### Modifications

#### GraphQL

We've added GraphQL support. Please read more on the [GraphQL Action Plan](https://github.com/DivanteLtd/vue-storefront/blob/develop/doc/GraphQL%20Action%20Plan.md). Starting from this release **bodybuilder** package is **deprecated**. You should use **SearchQuery** internal class that can be used against API and GraphQL endpoints. Read more on [how to query data](https://github.com/DivanteLtd/vue-storefront/blob/develop/doc/data/ElasticSearch%20Queries.md).

#### SSR - Advanced output + cache

However, this change is not involving any required actions to port the code but please just be aware that we're supporting [SSR Cache](https://github.com/DivanteLtd/vue-storefront/blob/develop/doc/SSR%20Cache.md) + [dynamic layout changes](https://github.com/DivanteLtd/vue-storefront/blob/develop/doc/Layouts%20and%20advanced%20output%20operations.md) etc. If You're using modified version of the theme - You can hardly use these without updating `themes/YourTheme/App.vue` to the new format (check the default theme for details).

#### Reviews

We've added the Reviews support, however Magento2 is still lacking Reviews support in the REST API. To have reviews up and running please add the https://github.com/DivanteLtd/magento2-review-api to Your Magento2 instance.

#### Microcart

1. We moved core functionalities of coupon codes to API modules:
   + **coupon** computed value is now **appliedCoupon** ([read more](https://github.com/DivanteLtd/vue-storefront/blob/master/doc/api-modules/cart.md))
   + **removeCoupon** ([read more](https://github.com/DivanteLtd/vue-storefront/blob/master/doc/api-modules/cart.md))
   + **applyCoupon** ([read more](https://github.com/DivanteLtd/vue-storefront/blob/master/doc/api-modules/cart.md))
   + **totals** -> **cartTotals** ([read more](https://github.com/DivanteLtd/vue-storefront/blob/master/doc/api-modules/cart.md))
   + **shipping** -> **cartShipping** ([read more](https://github.com/DivanteLtd/vue-storefront/blob/master/doc/api-modules/cart.md))
   + **payment** -> **cartPayment** ([read more](https://github.com/DivanteLtd/vue-storefront/blob/master/doc/api-modules/cart.md))
   
2. We moved/renamed methods responsible for UI to default theme:
   + **addDiscountCoupon** - toggle coupon form
   + **removeCoupon** -> **clearCoupon** - removing coupon by dispatch removeCoupon API method and toggle coupon form
   + **applyCoupon** -> **setCoupon** - submit coupon form by dispatch applyCoupon API method
   + **enterCoupon** - was removed, because @keyup="enterCoupon" we changed to @keyup.enter="setCoupon"
3. We moved $emit with notification about appliedCoupon and removedCoupon from vuex store to default theme. Now applyCoupon and removeCoupon returns promise which you can handle by ourself. 
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
1. We've removed event emit from client-entry.js with online status information. Instead of this we are using now [vue-offline](https://github.com/filrak/vue-offline) mixin. [#1494](https://github.com/DivanteLtd/vue-storefront/issues/1494)
2. We've removed isOnline variable from Microcart.js, instead of this we are using now variables from [vue-offline](https://github.com/filrak/vue-offline) mixin. [#1494](https://github.com/DivanteLtd/vue-storefront/issues/1494)

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

Now it mirrors `core/` folder structure which is desired behavior

### vue-storefront-api docker support has been extended

We've added the possibility to run the `vue-storefront-api` fully in docker (previously just the Elastic and Redis images were present in the `docker-compose.yml`. Please read the [README.md](https://github.com/DivanteLtd/vue-storefront-api) for more details.

**PLEASE NOTE:** We've changed the structure of the `elasticsearch` section of the config files, moving `esIndexes` to `elasticsearch.indices` etc. There is an automatic migration that will update Your config files automatically by running: `npm run migrate` in the `vue-storefront-api` folder.

### Default storage of the shopping carts and user data moved to localStorage

Currently there is an config option to setup the default local storage configs: https://github.com/DivanteLtd/vue-storefront/blob/271a33fc6e712b978e10b91447b05529b6d04801/config/default.json#L148. If You like the previous behaviour of storing the carts in the indexedDb - please change the config backend to `INDEXEDDB`.

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
import { coreComponent } from '@vue-storefront/core/lib/themes'

export default {
  mixins: [coreComponent('blocks/MyAccount/MyOrders')]
}
</script>
```

to


```vue
<script>
import MyOrders from '@vue-storefront/core/components/blocks/MyAccount/MyOrders'

export default {
  mixins: [MyOrders]
}
</script>
```
4. We've added Multistore support. It shouldn't imply any breaking changes to the existing themes / extensions (by default it's just disabled). More info on that: <a href="https://github.com/DivanteLtd/vue-storefront/blob/master/doc/Multistore%20setup.md">How to setup Multistore mode</a>.


## 1.0RC-2 -> 1.0RC-3 ([release notes](https://github.com/DivanteLtd/vue-storefront/releases/tag/v1.0.0-rc.3))
This release contains three important refactoring efforts:

1. We've changed the user-account endpoints and added the token-reneval mechanism which is configured by `config.users.autoRefreshTokens`; if set to true and user token will expire - VS will try to refresh it.

2. Moreover we've separated the user-account entpoints - so please copy the following defaults from `default.json` to Your `local.json` and set the correct api endpoints:

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

4. Another cool feature is `twoStageCaching` enabled by default. It means that for the Category page VS is getting only the minimum number of JSON fields required to display the ProductTiles and shortly after it downloads by the second request the full objects to store them im local cache.

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
