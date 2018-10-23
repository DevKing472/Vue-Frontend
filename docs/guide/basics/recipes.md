# FAQ and Recipes

Below you can find solutions for most common problems and advises for typical config changes required by Vue Storefront.
If you solved any new issues by yourself please let us know on [slack](http://vuestorefront.slack.com) and we will add them to the list so others don't need to reinvent the wheel.

## Problem starting docker while installing the vue-storefront

In case you get the following error:

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ERROR                                                                      │
│                                                                            │
│ Can't start docker in background.                                          │
│                                                                            │
│ Please check log file for details: /tmp/vue-storefront/var/log/install.log │
└────────────────────────────────────────────────────────────────────────────┘
```

Please check:

- if there is `docker-compose` command available, if not please do install it;
- please check the output of running `docker-compose up -d` manually inside the `vue-storefront-api` instance. On some production environments docker is limited for the superusers, in many cases it's just a matter of `/var/run/docker.sock` permissions to be changed (for example to 755)

## Product not displayed (illegal_argument_exception)

In a case of

```json
{
  "root_cause": [
    {
      "type": "illegal_argument_exception",
      "reason": "Fielddata is disabled on text fields by default. Set fielddata=true on [created_at] in order to load fielddata in memory by uninverting the inverted index. Note that this can however use significant memory. Alternatively use a keyword field instead."
    }
  ],
  "type": "search_phase_execution_exception",
  "reason": "all shards failed",
  "phase": "query",
  "grouped": true,
  "failed_shards": [
    {
      "shard": 0,
      "index": "vue_storefront_catalog_1521776807",
      "node": "xIOeZW2lTwaprGXh6YLyCA",
      "reason": {
        "type": "illegal_argument_exception",
        "reason": "Fielddata is disabled on text fields by default. Set fielddata=true on [created_at] in order to load fielddata in memory by uninverting the inverted index. Note that this can however use significant memory. Alternatively use a keyword field instead."
      }
    }
  ]
}
```

See the discussion in [#137](https://github.com/DivanteLtd/vue-storefront/issues/137).
Please also check the [Database tool](https://github.com/DivanteLtd/vue-storefront/blob/master/doc/Database%20tool.md)

## What's the recommended way to use git on custom development

One of the options is to do kind of fork - or just to get the whole repo to your Git service.
Then if you like to do some VS updates you probably need to just pull the changes from our origins. Another option will be available as soon as we manage to separate the core as a npm module

## How to add custom configurable attributes to Product page

Where can we add filters and extra configurable options for the products? For example, I've just added an iPhone X as an example. And I want to add the storage as an option.

![How to add additional custom attribute?](/vue-storefront/Apple_iPhone_X.png)

To do so, you need to modify the theme, changing the following snippet:

```html
<div class="row top-xs m0 pt15 pb40 variants-wrapper">
  <div v-if="option.label == 'Color'">
    <color-button
      v-for="(c, i) in options.color"
      :key="i"
      :id="c.id"
      :label="c.label"
      context="product"
      code="color"
      :class="{ active: c.id == configuration.color.id }"
    />
  </div>
  <div class="sizes" v-if="option.label == 'Size'">
    <size-button
      v-for="(s, i) in options.size"
      :key="i"
      :id="s.id"
      :label="s.label"
      context="product"
      code="size"
      class="mr10 mb10"
      :class="{ active: s.id == configuration.size.id }"
      v-focus-clean
    />
  </div>
```

You must add UI controls for additional configurable attributes.

## Product name changed to SKU when adding to cart / on product page

By default, when the user selects any specific product variant on the `Product.vue` page for `configurable` products - the title, picture, price and other attributes are changed to corresponding `simple` one (within `product.configurable_children`). If in the Magento panel the product names of the variants are set to SKU or anything else, then the correct behavior is that the product name change to it when selects variant.

To correct this behavior you can:

- modify the [core](https://github.com/DivanteLtd/vue-storefront/blob/6a5a569a7e96703b865f841dabbe3c6a1020b3ab/core/store/modules/product/actions.js#L311) - to filter out the `name` attribute from `Object.assign` which is responsible for copying the attributes from variant -> current product,
- modify `mage2vuestorefront` importer to correct the `configurable_children` [product names](https://github.com/DivanteLtd/mage2vuestorefront/blob/ca0c4723530b148cfdfb99784168af529e39d599/src/adapters/magento/product.js#L167)
- or just use bound to the `EventBus.$emitFilter('product-after-single', { key: key, options: options, product: products[0] })` event and modify the `product.configurable_children` properties:

```js
  if (product.configurable_children) {
    for (let configurableChild of product.configurable_children) {
        configurableChild.name = product.name
      }
    }
  }
```

## How to get dynamic prices to work (catalog rules)

After following the Tutorial on [how to connect to Magento2](../installation/magento.md) the prices are updated just after manually running [mage2vuestorefront cli command](https://github.com/DivanteLtd/mage2vuestorefront).

However there is an option to get the prices dynamically. To do so you must change the config inside `conf/local.json` from the default (`conf/default.json`):

```json
  "products": {
    "preventConfigurableChildrenDirectAccess": true,
    "alwaysSyncPlatformPricesOver": false,
    "clearPricesBeforePlatformSync": false,
    "waitForPlatformSync": false,
    "endpoint": "http://localhost:8080/api/product"
  },
```

to:

```json
  "products": {
    "preventConfigurableChildrenDirectAccess": true,
    "alwaysSyncPlatformPricesOver": true,
    "clearPricesBeforePlatformSync": true,
    "waitForPlatformSync": false,
    "endpoint": "http://localhost:8080/api/product"
  },
```

To make it work you need have Magento2 oauth keys configured in your `vue-storefront-api` - `conf/local.json`.
This change means that each time product list will be displayed, VS will get fresh prices directly from Magento without the need to re-index ElasticSearch.

## No products found! after node --harmony cli.js fullreindex

Take a look at the discussion at [#644](https://github.com/DivanteLtd/vue-storefront/issues/644)
Long story short -> you need to run the following command within the `mage2nosql` project:

```bash
node cli.js products --partitions=1
```

## How to sync the products cart with Magento to get the Cart Promo Rules up and running

To display the proper prices and totals after Magento calculates all the discounts and taxes you need to modify the `conf/local.json` config (for a reference take a look at `conf/default.json`) by putting there an additional section:

```json
  "cart": {
    "synchronize": true,
    "synchronize_totals": true,
    "create_endpoint": "http://localhost:8080/api/cart/create?token={{token}}",
    "updateitem_endpoint": "http://localhost:8080/api/cart/update?token={{token}}&cartId={{cartId}}",
    "deleteitem_endpoint": "http://localhost:8080/api/cart/delete?token={{token}}&cartId={{cartId}}",
    "pull_endpoint": "http://localhost:8080/api/cart/pull?token={{token}}&cartId={{cartId}}",
    "totals_endpoint": "http://localhost:8080/api/cart/totals?token={{token}}&cartId={{cartId}}"
  },
```

To make it work you need have Magento2 oauth keys configured in your `vue-storefront-api` - `conf/local.json`.

After this change you need to restart the `yarn dev` command to take the config changes into consideration by the VS. All the cart actions (add to cart, remove from cart, modify the qty) are now synchronized directly with Magento2 - for both: guest and logged in clients.

## How to prevent an error "Can’t build storefront npm"

The error "Can't build storefront npm" appears because npm can't automatically install required modules. To prevent this error, you should manually install those modules before running the installer. It's easy:

```bash
git clone https://github.com/DivanteLtd/vue-storefront.git vue-storefront && cd vue-storefront
npm install
npm install vue-carousel vue-no-ssr
npm run build # check if no errors
npm run installer
```

## How to integrate 3rd party platform? Do you think it could be used with a legacy bespoke PHP eCommerce?

Yes I believe it could. You should expose the API accordingly to our [spec](../extensions/extending-api.md) and the second step is to [create a data bridge](https://medium.com/@piotrkarwatka/how-to-connect-3rd-party-platform-to-vue-storefront-df9cb30779f6) to fill out the ElasticSearch with the current catalog data.

## Is there any documentation on integrating payment gateways?

We're working on kind of boilerplate for payment modules. Right now please just take a look at a [live example](https://github.com/develodesign/vue-storefront-stripe) and try to follow the design patterns from there. The task where boilerplate + docs will show up is: [https://github.com/DivanteLtd/vue-storefront/issues/923](https://github.com/DivanteLtd/vue-storefront/issues/923).

## Is there any internationalization support?

Yes, we already have 7 languages supported by default (EN, FR, ES, RU, JP, NL, DE) and the [documentation for translations](../core-themes/translations.md).

The currency is set in the `local.json` configuration file and it's (along with the language) set per instance - so if you have a few languages and countries supported you need to run (as for now) a few separate instances

## If 10k products are on the site will it create a high bandwidth download when you navigate on the site for the first time on a mobile device

Not necessarily. Vue Storefront is caching products from the categories browsed. This is default solution which can be changed by modifying `core/store/lib/search.js`

## How to add/remove/change field types in the ElasticSearch schema

It's done via Database Tool schema changes. Please follow the instructions from the [Database Tool Manual](../data/database-tool.md#chaning-the-index-structure--adding-new-fields--chaning-the-types).

## How to integrate 3rd party Magento extensions

Unfortunately, Magento extensions are not compliant with any PWA available solution yet. So if you would like to integrate some existing extensions, the simplest way is to:

- expose the data via some Magento2 REST api endpoints;
- consume the endpoints in the VS using Vuex stores; [read more](../vuex/introduction.md) about Vuex in Vue Storefront;
- implement the UI in VS

If the extensions are not playing with the User Interface, probably they will work with VS out of the box, as we're using the standard Magento2 API calls for the integration part.

## How to support Multistore / Multiwebsite setup

Please check the [Multistore setup](../integrations/multistore.md) guide for details

## How to deal with Category filters based on configurable_children

If you would like to have a Category filter working with configurable products, you need to expand the `product.configurable_children.attrName` to `product.attrName_options` array. This is automatically done by [mage2vuestorefront](https://github.com/DivanteLtd/mage2vuestorefront) for all attributes set as `product.configurable_options` (by default: color, size). If you like to add additional fields like `manufacturer` to the filters, you need to expand `product.manufacturer_options` field. The easiest way to do so is to set `config.product.expandConfigurableFilters` to `['manufacturer']` and re-run the `mage2vuestorefront` indexer.

## How to redirect original Magento2 urls to Vue Storefront

There is a SEO redirects generator for nginx -> `https://serverfault.com/a/441517` available within the [vue-storefront-api](https://github.com/DivanteLtd/vue-storefront-api/commit/2c7e10b4c4294f222f7a1aae96627d6a0e23f30e). Now you can generate SEO map redirecting users from the original Magento urls to Vue Storefront URLs by running:

```bash
npm run seo redirects — —oldFormat=true | false
```

- `oldFormat` - should be set accordingly to the `vue-storefront/config/local.json` setting of `products.useShortCatalogUrls` (`oldFormat` = `!useShortCatalogUrls`)

Please make sure that `vue-storefront/config/local.json` setting of `useMagentoUrlKeys` is set to `true` and you have ElasticSearch synchronized with the Magento2 instance using current version of [mage2vuestorefront](https://github.com/DivanteLtd/mage2vuestorefront).

## You need to choose options for your item message when hit API for add to cart a configurable product

This is because the demo data dump works on the `demo-magento2.vuestorefront.io` instance attribute ids. Please re-import all product data using [mage2vuestorefront](https://github.com/DivanteLtd/mage2vuestorefront)

## Adding custom category filters

You need to add the attributes you'll like to have displayed to the `config/local.json` field name is: `products.defaultFilters`:

```json
"defaultFilters": ["color", "size", "price", "erin_recommends"],
```

And then You can use proper controls for each individual filter [here](https://github.com/DivanteLtd/vue-storefront/blob/49dc8a2dc9326e9e83d663cc27f8bb0688525f13/src/themes/default/components/core/blocks/Category/Sidebar.vue).
