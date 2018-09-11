***Important*** Modules are under heavy development. Only a few parts of Vue Storefront are rewritten to modular architecture but we are aiming to rewrite everything soon along with adding TypeScript support and Unit tests to each of them. Some concepts may change over time before we introduce the final version of VS Modules.

# What are VS modules?

You can think about each module as a one, independent feature available in Vue Storefront with all it's logic and dependencys inside. This 'one feature' however is a common denominator that links all the features inside. For example common denominator for adding product to the cart, receiving list of items that are in a cart or applying a cart coupon is obviously a `cart` and `cart` is not a feature of anything bigger than itself so it should be a module. Wishlist or Newsletter are also a good examples of modules as we intuitively think about them as a standalone features. If you still have troubles with understanding what exactly they are at this point, don't worry - you can find a better explaination below. 

# Motivation

I believe that some neat metaphore can clearly describe the problem as well as a solution.

To better illustrate the whole concept I'll try to explain it with lego bricks. 

Let's say we have a box with 90 lego bricks that we can use to build some fancy things like Towers, Castles, or Helicopters. Unfortunately due to some stupid EU regulations we can only have 3 different colors of bricks in our box. As we all know not every color is accurate for every structure that can be built  so we need to swap one color with a different one from the shop from time to time to have bricks in colors that are best-suited for our next lego project. 

Cool, but there is one problem - since we have all our bricks in one box they look more or less like this:

<img src="http://www.robomiku.ee/wp-content/uploads/2016/10/9027.png" style="width: 150px;" />

When we want to replace the green bricks with, let's say, the black ones we need to look for each green brick separately among all the others which can take a lot of time... and there is still a chance that we will miss some of them! Not to mention that finding the particular green brick that we need to finish the palm tree we are building ([this one!](https://www.thedailybrick.co.uk/media/catalog/product/cache/1/image/700x700/9df78eab33525d08d6e5fb8d27136e95/l/e/lego_small_palm_leaf_8_x_3__6148__lego-green-small-palm-leaf-8-x-3-6148-30-257873-61.jpg)) will require looking for it among all the other bricks which can make this task extremely difficult and time-consuming.

This is obviously not a situation that we want to end up in with our small lego empire. Neither we want it with Vue Storefront since it's meant to be easly extendable so you can replace your green bricks (or current user cart feature) with the black ones (different cart feature with multiple carts) without looking for each of them among all the bricks and without worrying that you will miss some of them and EU will confiscate all the bricks . that you have! We also want to make it easier to find the exact brick that we want right now to finish this damn palm tree! 

So how we make this horrible situation better?

Introducing... (drums in the background) ***bricks grouped by colors***! (wows in the background)
  
<img src="https://sh-s7-live-s.legocdn.com/is/image/LEGO/6177?$PDPDefault$" style="width: 150px;" />
  
When we have our bricks grouped by their colors (and in a separate boxes - modules) it's much easier to find this green brick that we needed for a palm tree since we only need to search in a small subset of all bricks. Moreover when we want to replace green bricks with the black ones then instead of looking for all the grren represenattives one by one we are just replacing their box with the one containing black bricks. We also don't need to worry that something was left since we know that all the green bricks were in the box.

This is the kind of modularity and extendibility we want in Vue Storefront. If you think about each small feature (or user story) like signing in or adding product to a cart as a brick then we can group them by their common denominator which in case of bricks is a color but in case of user stories it can be some particular subset of data/features that we are interacting with (like a Cart, Acoount etc).

# What is the purpose of VS modules?

The purpose is well described in [this discussion](https://github.com/DivanteLtd/vue-storefront/issues/1213). It can be sumamrized to:
- **Better extensibility**: We can extend each module or replace it completely with the new one. For example we may want to replace our Cart module with the one that allows to have multiple carts. With modules we can just detach current Cart module and repalce it with our new one. Another example can be using different modules for different content CMSes integration etc. 
- **Better developer experience**: Along with the modules we are introducing many features focused on delivering better, easier to jump in and more predictable developer experience. We changed the way you can compose components with features, added unit tests, TypeScript interfaces etc.
- **Better upgradability**: Each module is a separate NPM pacage therefore can be upgraded independently and since it have all the logic encapsulated it shouldn't break any other parts of the application when detached, modified or replaced.

# How module should look like

Module by it's definition should encapsulate all logic required for the feature it represents. You can think about each module as a micro application that exposes it's parts to the outside world (Vue Storefront).

Normally module can (but not must) contain following folders:

- `features` - Atomic, almost undividable features related to this module that can be used to build your components. Each of this features can be treated as one user story. Examples of such features are: Adding product to the cart, signing in, signing out, removing product from the wishlist, getting products that are in a cart etc. We can use this features in components by importing the ones that we need from the module `import { addToCart, removeFromCart } from 'module/cart/features`*
- `components` - components related to this module (eg. Microcart for Cart module)
- `store` - Vuex store associated to module
- `helpers` - everything else that is meant to support modules behavior
- `types` - TypeScript types associated with module
- `test` - folder with unit tests which is *required* for every new or rewritten module. This folder can be placed outside of the module in 'tests' folder.
- `extends` - code that you need to include into core files such as client/server entry, app entry, webpack config or service worker. If you need to extend, let's say `client-entry.js`just create a file with the same name and import it in the core `client-entry.js` by invoking files content with `import core/module/module-name/extends/client-entry.js


[*] currently we are using `core/api/module_name` instead of `module/module_name` but it's about to change soon

# Contributions

Please introduce every new feature as a standalone, encapsulated module. We also need your help in rewriting Vue Storefront to modular approach - [here](https://github.com/DivanteLtd/vue-storefront/issues?q=is%3Aissue+is%3Aopen+label%3A%22API+Module%22) you can find tasks related to this architectural change and [here](https://github.com/DivanteLtd/vue-storefront/blob/master/doc/api-modules/refactoring-to-modules.md) is the tutorial how to approach applying this changes.

# Refactoring current core components into modules

Read a [separate doc](https://github.com/DivanteLtd/vue-storefront/blob/master/doc/api-modules/refactoring-to-modules.md) about refactoring current VS code to modules


