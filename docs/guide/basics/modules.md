# Modules

## What are VS modules?

You can think about each module as a one, independent feature available in Vue Storefront with all it's logic and dependencies inside. This 'one feature' however is a common denominator that links all the features inside. For example common denominator for adding product to the cart, receiving list of items that are in a cart or applying a cart coupon is obviously a `cart` and `cart` is not a feature of anything bigger than itself (it's common denominator is a shop) so it should be a module. Wishlist, Reviews or Newsletter are also a good examples of modules as we intuitively think about them as a standalone features.

# Motivation

I believe that some neat metaphor can clearly describe the problem as well as a solution.

To better illustrate the whole concept I'll try to explain it with lego bricks.

Let's say we have a box with 90 lego bricks that we can use to build some fancy things like Towers, Castles, or Helicopters. Unfortunately due to some stupid EU regulations we can only have 3 different colors of bricks in our box. As we all know not every color is accurate for every structure that can be built so we need to swap one color with a different one from the shop from time to time to have bricks in colors that are best-suited for our next lego project.

Cool, but there is one problem - since we have all our bricks in one box they look more or less like this:

![Bricks](http://www.robomiku.ee/wp-content/uploads/2016/10/9027.png)

When we want to replace the green bricks with, let's say, the black ones we need to look for each green brick separately among all the others which can take a lot of time... and there is still a chance that we will miss some of them! Not to mention that finding the particular green brick that we need to finish the palm tree we are building ([this one!](https://www.thedailybrick.co.uk/media/catalog/product/cache/1/image/700x700/9df78eab33525d08d6e5fb8d27136e95/l/e/lego_small_palm_leaf_8_x_3__6148__lego-green-small-palm-leaf-8-x-3-6148-30-257873-61.jpg)) will require looking for it among all the other bricks which can make this task extremely difficult and time-consuming.

This is obviously not a situation that we want to end up in with our small lego empire. Neither we want it with Vue Storefront since it's meant to be easily extendable: so you can replace your green bricks (or current user cart feature/cms provider/cms content provider) with the black ones (different cart feature with multiple carts, Wordpress instead of Prismic for content etc) without looking for each of them among all the bricks. You don't need to worry that you will miss some of them and EU will confiscate all the bricks that you have! We also want to make it easier to find the exact brick that we want right now to finish this damn palm tree!

So how we make this horrible situation better?

Introducing... (drums in the background) **_bricks grouped by colors_**! (wows in the background)

![Bricks grouped by colors](https://sh-s7-live-s.legocdn.com/is/image/LEGO/6177?$PDPDefault$)

When we have our bricks grouped by their colors (and in a separate boxes - modules) it's much easier to find this green brick that we needed for a palm tree since we only need to search in a small subset of all bricks. Moreover when we want to replace green bricks with the black ones then instead of looking for all the green representatives one by one we are just replacing their box with the one containing black bricks. We also don't need to worry that something was left since we know that all the green bricks were in the box.

This is the kind of modularity and extendibility we want in Vue Storefront and architecture we are currently rewriting it into.

# What is the purpose of VS modules?

The purpose is well described in [this discussion](https://github.com/DivanteLtd/vue-storefront/issues/1213). It can be summarized to:

- **Better extensibility**: We can extend each module or replace it completely with the new one. For example we may want to replace our Cart module with the one that allows to have multiple carts. With modules we can just detach current Cart module and replace it with our new one. Another example can be using different modules for different content CMS integration etc.
- **Better developer experience**: Along with the modules we are introducing many features focused on delivering better, easier to jump in and more predictable developer experience. We changed the way you can compose components with features, added unit tests, TypeScript interfaces etc.
- **Better upgradability**: Each module is a separate NPM package therefore can be upgraded independently and since it have all the logic encapsulated it shouldn't break any other parts of the application when detached, modified or replaced.

## Module config and capabilities

Module config is the object that is required to instantiate VS module. The config object you'll provide is later used to extend and hook into different parts of the application (like router, Vuex etc).
Please use this object as the only part that is responsible for extending Vue Storefront. Otherwise it may stop working after some breaking core updates.

Vue Storefront module object with provided config should be exported in `index.ts` entry point. Ideally it should be a named export named the same as modules key.

This is how the signature of Vue Storefront Module looks like:

```js
interface VueStorefrontModuleConfig {
  key: string;
  store?: {
    module?: Module<any, any>,
    plugin?: Function,
    extend?: { key: string, module: Module<any, any> }[],
  };
  router?: {
    routes?: RouteConfig[],
    beforeEach?: NavigationGuard,
    afterEach?: NavigationGuard,
  };
  beforeRegistration?: (
    Vue?: VueConstructor,
    config?: Object,
    store?: Store<RootState>,
  ) => void;
  afterRegistration?: (
    Vue?: VueConstructor,
    config?: Object,
    store?: Store<RootState>,
  ) => void;
}
```

See code [here](https://github.com/DivanteLtd/vue-storefront/blob/develop/core/modules/index.ts)

### `key` (required)

Key is an ID of your module. It's used to identify your module and to set keys in all key-based extensions that module is doing (like creating namespaced store). This key should be unique. You can duplicate the keys of some other modules only if you want to extend them. Modules with the same keys will be merged.

### `store`

Entry point for Vuex.

- `module` - if your extension requires new Vuex module registration put it in here. Use this property only to create new modules. If you want to extend currently existing ones use `extend` property
- `plugin` - you can provide your own Vuex plugin here
- `extend` - extends currently existing Vuex module with provided `key`. Given modules will be merged in favour of the extending one (actions/mutations with the same name will be overwritten)

### `router`

Entry point for vue-router. You can provide additional routes and [navigation guards](https://router.vuejs.org/guide/advanced/navigation-guards.html) here.

### `beforeRegistration`

Function that'll be called before registering the module both on server and client side. You have an access to `Vue`, `store` and `config` instances inside.

### `afterRegistration`

Function that'll be called after registering the module both on server and client side. You have an access to `Vue`, `store` and `config` instances inside.

## Module file structure

Below you can see the recommended file structure for a VS module. All of the core ones are organized in this way.
Try to have the similar file structure inside the ones that you create. If all modules implement a similar architecture it'll be easier to maintain and understand them. If there is no reason to organize some of its parts differently try to avoid it.

Not all of this folders and files are necessary in every module. The only mandatory file is `index.ts` which is an entry point. The rest depends on your needs and module functionality.

You can take a look at [module template](https://github.com/DivanteLtd/vue-storefront/tree/master/core/modules/module-template) with example implementation of all features listed in config.

- `components` - Components logic related to this module (eg. Microcart for Cart module). Normally it contains `.ts` files but you can also create `.vue` files and provide some baseline markup if it is required for the component to work out of the box.
- `pages` - If you want to provide full pages with your module, place them here. It's also a good practice to extend router configuration for this pages
- `store` - Vuex Module associated to this module. You can also place Vuex modules extensions in here
  - `index.ts` - Entry point and main export of your Vuex Module. Actions/getters/mutations can be split into different files if logic is too complex to keep it in one file. Should be used in `store` config property.
  - `mutation-types.ts` - Mutation strings represented by variables to use instead of plain strings
  - `plugins.ts` - Good place to put vuex plugin. Should be used in `store.plugins` config object
- `types` - TypeScript types associated with the module
- `test` - Folder with unit tests which is _required_ for every new or rewritten module.
- `hooks` - before/after hooks that are called before and after registration of the module.
  - `beforeRegistration.ts` - Should be used in `beforeRegistration` config property.
  - `afterRegistration.ts` - Should be used in `afterRegistration` config property.
- `router` - routes and navigation guards associated to this module
  - `routes.ts`- array of route objects that will be added to current router configuration. Should be used in `router.routes` config property.
  - `beforeEach.ts` - beforeEach navigation guard. Should be used in `router.beforeEach` config property.
  - `afterEach.ts`- afterEach navigation guard. Should be used in `router.afterEach` config property.
- `queries` - GraphQL queries
- `helpers` - everything else that is meant to support modules behavior
- `index.js` - entry point for the module. Should export VueStorefrontModule. It's also a good place to instantiate a cache storage.

## Module registration

All modules including the core ones are registered in `theme/modules.ts` file. Thanks to this approach you can easily modify any of core modules object before the registration.

All VS modules from `registerModules` will be registered during the shop initialization.

## General rules and good practices

First take a look at module template. It contains some great examples, good practices and explanations for everything that can be put in module.

1. **Try not to rely on any other data sources than `config`**. Use other stores only if it's the only way to achieve some functionality and import `rootStore` for this purposes. Modules should be standalone and rely only on themselves

2. **Place all reusable features as a Vuex actions** (e.g. `addToCart(product)`, `subscribeNewsletter()` etc) instead of placing them in components. try to use getters for modified or filtered values from the state. We are trying to place most of the logic in Vuex stores to allow easier core updates. Here is a good example of such externalization.

```js
export const Microcart = {
  name: 'Microcart',
  computed: {
    productsInCart(): Product[] {
      return this.$store.state.cart.cartItems;
    },
    appliedCoupon(): AppliedCoupon | false {
      return this.$store.getters['cart/coupon'];
    },
    totals(): CartTotalSegments {
      return this.$store.getters['cart/totals'];
    },
    isMicrocartOpen(): boolean {
      return this.$store.state.ui.microcart;
    },
  },
  methods: {
    applyCoupon(code: String): Promise<boolean> {
      return this.$store.dispatch('cart/applyCoupon', code);
    },
    removeCoupon(): Promise<boolean> {
      return this.$store.dispatch('cart/removeCoupon');
    },
    toggleMicrocart(): void {
      this.$store.dispatch('ui/toggleMicrocart');
    },
  },
};
```

3. **Don't use `EventBus`**.

4. **If you want to inform about success/failure of core component method you can either use a callback or scoped event**. Omit Promises if you think that function can be called from the template and you'll need the resolved value. This is a good example of method that you can call either on `template` ot `script` section:

```js
addToCart(product, success, failure) {
  this.$store.dispatch('cart/addToCart').then(res =>
    success(res)
  ).catch(err =>
    failure(err)
  )
}
```

Try to choose method basing on use case. [This](https://github.com/DivanteLtd/vue-storefront/blob/develop/core/modules/mailchimp/components/Subscribe.ts#L28) is a good example of using callbacks.

5. **Create pure functions that can be easily called with different argument**. Rely on `data` properties instead of arguments only if it's required (for example they are validated like [here](https://github.com/DivanteLtd/vue-storefront/blob/develop/core/modules/mailchimp/components/Subscribe.ts#L28).

6. **Document exported components** like in [this example](https://github.com/DivanteLtd/vue-storefront/blob/develop/core/modules/mailchimp/components/Subscribe.ts)

7. If your module core functionality is an integration with external service better name it the same as this service (for example `mailchimp`).

8. **Use named exports and typecheck**.

## Adding new features as VS modules

- If you are creating a new feature first think if it's not just extending a currently existing one. If you are sure that feature you want to provide is completely new, then it should be introduced as a new VS module.
- Provide unique key that should represent the feature or 3rd party system name (if the module is an integration)
- Try not to rely on data and logic from other modules if your module is not directly extending it. It'll be more reusable and remain working even after extensive VS core updates.

## Extending currently existing features with modules

If you want to create an extension, the best approach is to introduce it as a VS module. If you want to extend some of currently existing modules with application-specific logic, you can extend it directly before registration instead of creating whole new module.

You can extend Vuex stores from any other VS module. Good practice is to create a folder with the same name as module you want to extend inside `store` folder of your module. Mutations/actions/state properties will be merged to currently existing module. In case of conflicting names the old ones will be overwritten. You can find an example of mailchimp module extension [here](https://github.com/DivanteLtd/vue-storefront/tree/develop/core/modules/module-template/store/mailchimp).

Once the extension is ready register it under the `store.extend` module property with a key of module you wish to extend.

In the example below we are extending `mailchimp` module with `extendMailchimp` object.

```js
const moduleConfig: VueStorefrontModuleConfig = {
  key: KEY,
  // other properties
  store: { extend: [{ key: 'mailchimp', module: extendMailchimp }] },
};
```

## Extending module from theme before registration

All modules are registered from your theme. Before the registration you can easily modify their config object and extend/replace any part of it. If you want to make any application-specific modifications of the core this is the best way. In the example below we are modifying the `example` module. The config object you provide to `extend()` will be deep merged with currently existing one. Conflicting keys in Vuex modules will be overwritten.

```js
import { Example } from './modules/module-template';

const extendedExample: VueStorefrontModuleConfig = {
  key: 'extend',
  afterRegistration: function(Vue, config) {
    console.info('Hello, im extended now');
  },
};

Example.extend(extendedExample);

export const enabledModules: VueStorefrontModule[] = [
  // other modules
  Example,
];
```

## Contributions

Please introduce every new feature as a standalone, encapsulated module. We also need your help in rewriting Vue Storefront to modular approach - [here](https://github.com/DivanteLtd/vue-storefront/issues?q=is%3Aissue+is%3Aopen+label%3A%22API+Module%22) you can find tasks related to this architectural change and [here](https://github.com/DivanteLtd/vue-storefront/blob/master/doc/api-modules/refactoring-to-modules.md) is the tutorial how to approach applying this changes.

## Refactoring current core components into modules

Read a [separate doc](https://github.com/DivanteLtd/vue-storefront/blob/master/doc/api-modules/refactoring-to-modules.md) about refactoring current VS code to modules
