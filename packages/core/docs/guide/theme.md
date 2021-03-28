# Theme

If you [use our CLI to set up your project](./general/getting-started) you will end up with a fully functional eCommerce theme connected to your eCommerce backend and a bunch of other services based on [Nuxt.js](https://nuxtjs.org/)

## High-level overview

Your theme out of the box will have following features:

**Pages**

- Home Page
- Product Listing Page
- Product Details Page
- Mini Cart
- Mini Wishlist <Badge text="Enterprise" type="info" />
- User Authentication
- User Profile <Badge text="Enterprise" type="info" />
- Checkout
- Custom 404 page

**Integrations**

- eCommerce full scope <Badge text="Enterprise" type="info" /> / eCommerce basic scope
- CMS integration <Badge text="Enterprise" type="info" />
  - Home Page
  - Custom CMS Page
  - Header
  - Footer
- Payment integration <Badge text="Enterprise" type="info" />

**Other**

- Progressive Web App features
- internationalization

A full list of features (for Enterprise version) can be found [here](/enterprise/feature-list.html).

## Directory structure

If you're familiar with Nuxt.js, you will quickly notice that the directory structure is almost identical to the standard Nuxt.js project. Since you can read about the Nuxt project folder structure in [Nuxt docs](https://nuxtjs.org/docs/2.x/get-started/directory-structure), we will cover mostly the directories specific to Vue Storefront.

```js
.
├─ components/
├─ composables/ // custom, theme-related composables
├─ lang/ // i18n translation keys
├─ layouts/
├─ middleware/
│  └─ checkout.js // prevents users from entering checkout steps if certain information is missing
├─ pages/
├─ static/
├─ middleware.config.js // integrations configuration
└─ nuxt.config.js
```

## Storefront UI

::: tip Want to use another UI library? No problem!
If you don't want to use Storefront UI feel free to remove it from your project - it's just a UI layer and the project can work with any other UI library or a custom code.
:::

Our default theme is based on [Storefront UI](http://storefrontui.io/) - a design system and library of Vue.js components dedicated to eCommerce maintained by Vue Storefront core team. The library is fully customizable on multiple levels to make sure that it can be used in different contexts and with different designs.

<img src="https://camo.githubusercontent.com/5e44d945fe332e31a78af2f8345cdb3aae2de666aa3619ca81f67da7ff2187f8/68747470733a2f2f692e6962622e636f2f37534b627a354b2f3132333435372e706e67" />

With Storefront UI you're getting both [Vue.js components](<(https://storybook.storefrontui.io/)>) and [Figma designs](figma.com/file/N0Ct95cSAoODNv7zYS01ng/Storefront-UI-%7C-Design-System?node-id=0%3A1) that match them so it's straightforward for your design team to customize them. The library works great for the multi-tenancy model as a shared UI library that can be customized differently for each tenant.

To learn more about Storefront UI please check:

- [Storybook](https://storybook.storefrontui.io/) where you can find a list of all it's available components
- [Documentation](https://docs.storefrontui.io/) where you can find the information about customization possibilities and setup

## Preinstalled modules and libraries

Below you can find a list of the most important Nuxt Modules and libraries that are preinstalled with the default theme:

<!-- todo make proper docs for vsf modules and move their submodules to these docs-->

### Nuxt Modules

- `@nuxtjs/pwa`
- `nuxt-i18n`
- `@vue-storefront/nuxt`
  - `@nuxtjs/composition-api`
  - `@nuxt/typescript-build`
  - `@nuxtjs/style-resources`
  - `nuxt-purgecss`
- `@vue-storefront/nuxt-theme`

### Libraries

- [`@storefront-ui/vue`](https://storefrontui.io)
- [`wee-validate`](https://vee-validate.logaretm.com/v3)
