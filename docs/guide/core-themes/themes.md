# Themes in Vue Storefront

Vue Storefront allows you to quickly develop your own themes and use our core business logic. All e-commerce features are implemented in core, so you can easily develop fully working online shop only by writing HTML and CSS and inheriting the business logic from the core. Of course, you can easily modify and extend the core logic in your theme.

You can read more about Vue Storefront core components and how to make use of them [here](core-components.md)

All themes are located in `src/themes` folder and you can think about them as a separate Vue.js applications that are using Vue Storefront core for out-of-the-box features.

## Switching themes

To use any of the themes located in `src/themes`, just change the `theme` property in your config file to `name` property from package.json file sitting in your theme's root dir. Config files are located in `config` folder. You shouldn't make changes in `config/default.json`. Instead just copy the `default.json` file to the same folder, name it `local.json` and make changes there.

## Creating your own themes

There are two ways of creating your own VS theme

1. Copying and modifying the default theme which is fully-styled and ready to work out of the box (it's the one that you can find on our demo)
2. Copying and modifying theme-starter which contains only data and no styling. It requires more work to have it production-ready (you need to style it from scratch) but if your designs are much different than our default theme you'd probably want to start with this one.

To create your own theme just copy the `theme-starter` or `default` folder located in `src/themes` and change it's name to your new theme's name. Next change the name property in your theme `package.json` file. You can use this name in your config file to change the active theme. After adding new theme you need to run `yarn install` so lerna can detect a new theme. Now you can start development of your own theme for Vue Storefront!

Only official themes tested and accepted by the community should be in a `master` branch. Please develop your own themes on separate branches and keep them updated with `master` to be sure it works with the newest core.

## Important theme files

Each theme is a separate Vue.js application with its own dependencies, which can make use of the core or even modify it.
Below you can find the list of files that are essential for your theme to work:

- `extensions` - theme-specific extension (see [Working with extensions](extensions.md))
  - `index.js` - here you can register your theme-specific extensions
- `filters` - theme-specific filters (extends `core/filters`)
  - `index.js` - here you can register your theme-specific filters
- `mixins` - theme-specific mixins (extends `core/mixins`)
  - `index.js` - here you can register your theme-specific mixins
- `pages` - your shop pages
- `plugins` - theme-specific plugins (extends `core/plugins`, see [Working with plugins](plugins.md)
- `resource` - theme-specific resources (extends `core/resource`)
- `router` - theme router
- `store` - theme-specific stores (extends `core/store`)
  - `ui-store.js` - here you can extend core `ui-store`
  - `index.js` - here you can register theme-specific stores
- `App.vue` - theme's entry component
- `index.js` - theme initialization
- `package.json` - theme-specific dependencies
- `service-worker`
  - `index.js` you can extend core service worker here (see [Working with Service Workers](service-workers.md)
- `webpack.config.js` - you can extend core webpack build in this file (extends `core/build/`, see [Working with webpack](webpack.md))

## Official Vue Storefront themes included with the template:

- `default` - Default VS theme always with newest features. The easiest way to adopt VS in your shop is taking this one and modifying it to your needs (check [gogetgold.com](https://www.gogetgold.com/) as an example)
- `theme-starter` - boilerplate for developing VS themes. If you want to create new theme copy and rename this folder.
- `catalog` - VS catalog theme - currently in alpha

## Related

- [Working with components](core-components.md)
- [Creating themes in Vue Storefront — backend-agnostic eCommerce PWA frontend (part 1  - understanding Vue Storefront core)](https://medium.com/@frakowski/developing-themes-in-vue-storefront-backend-agnostic-ecommerce-pwa-frontend-part-1-72ea3c939593)
