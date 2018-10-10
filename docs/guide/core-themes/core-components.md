# Working with core components

## Vue Storefront component types

In Vue Storefront there are two types of components:

- **Core components** (`core/components`) - In core components we implemented all basic business logic for e-commerce shop, so you don't need to write it from scratch by yourself. You can make use of them in your themes where all you need to do is styling and creating the HTML markup. Every core component provides an interface to interact with. This interface can be extended or overwritten in your theme if you need it. Core components should be injected to themes as mixins. They contain only business logic - HTML markup and styling should be done in themes.

- **Theme components** (`src/themes/{theme_name}/components`) - the theme component is what you really see in the app. They can inherit business logic from core components or be created as theme-specific components. All CSS and HTML should be placed in theme. A good practice is to create theme components that inherit from specific core components with the same name and in the same path (e.g components inheriting from (`core/components/ProductTile.js`) should be placed (`src/themes/{theme_name}/components/core/ProductTile.vue`) but it's not obligatory and you can structure your theme in any way you want.

## Using core components in your theme

### For components

Inheritance by itself is done by [vue mixins](https://vuejs.org/v2/guide/mixins.html) with default merging strategy.

To inherit from core component:

1. **Create new component in your theme**

2. **Import the core component that you want to include:**

```js
import YourCoreComponent from '@vue-storefront/core/components/YourCoreComponent';
```

3. **Add core components mixin to your newly created theme component:**

```js
export default {
  ...
  mixins: [YourCoreComponent]
}
```

From now you can access and override all methods, data and components from core component like it was declared in your own theme component.

### For pages

Inheritance in pages works exactly like in other components. The only difference is the importing alias. Instead of `core/components` we need to start with `core/pages` alias

```js
import YourCorePage from '@vue-storefront/core/pages/YourCorePage'

export default {
  ...
  mixins: [YourCorePage]
}
```

Core pages are placed in `core/pages` folder.

## Working with core components

First of all: **override core components only when you're adding features to the core**. The correct approach for using core components in your theme is thinking of them as an external API. You can inherit the functionalities and extend them in theme but never change it in a core.

**When you're modifying the core component never change the component's API** (data and methods exposed by component for themes). Such changes would break the themes using this core component.

### The core component folders structure

- `core/components` - Components that can be used across whole project should be placed in the root of this folder.
- `core/components/blocks` - All other components specific to pages (e.g Home, Category), other components (e.g Header, Footer) or functionalities (e.g Auth).

### Rules to follow when creating new core components

1. Use `.js` files for core mixins instead of `.vue` files
2. Put only theme-agnostic business logic in core components.

## Core components docs

:::tip Note
Please keep in mind we are still working on these docs
:::

### Pages

- [Home](../components/home-page.md) - [`Home.vue`](https://github.com/DivanteLtd/vue-storefront/blob/master/core/pages/Home.vue)
- [Category](../components/category-page.md) - [`Category.vue`](https://github.com/DivanteLtd/vue-storefront/blob/master/core/pages/Category.vue)
- [Product](../components/product.md) - [`Product.vue`](https://github.com/DivanteLtd/vue-storefront/blob/master/core/pages/Product.vue)
- ...

### Components

- [Modal](../components/modal.md) - [`Modal.vue`](https://github.com/DivanteLtd/vue-storefront/blob/master/core/components/Modal.vue)
- ...

## Related

- [Working with themes](themes.md)
- [Creating themes in Vue Storefront - Part 1 ('Using Vue Storefront core in your theme' section)](https://medium.com/@frakowski/developing-themes-in-vue-storefront-backend-agnostic-ecommerce-pwa-frontend-part-1-72ea3c939593)
