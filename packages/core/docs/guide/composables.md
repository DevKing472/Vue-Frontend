# Composables

> If you are not familiar with Composition APIs, we recommend reading [this article](/guide/composition-api) first.

Composable is a function that uses [Composition API](#composition-api) under the hood. Composables are the main public API of Vue Storefront and, in most cases, the only API except configuration you will work with.

You can treat composables as independent micro-applications. They manage their own state, handle server-side rendering, and rarely interact with each other (except [useUser](/composables/use-user.html) and [useCart](/composables/use-cart.html)). No matter what integration you are using, your application will always have the same set of composables with the same interfaces.

To use a composable, you need to import it from an integration you use, and call it on the component `setup` option:

```js
import { useProduct } from '{INTEGRATION}';
import { onSSR } from '@vue-storefront/core`

export default {
  setup() {
    const { products, search} = useProduct();

    onSSR(async () => {
      await search(searchParams)
    })

    return {
      products
    };
  }
};
```

> `onSSR` is used to perform an asynchronous request on the server side and convey the received data to the client. You will learn more about it next section.

For some composables (like `useProduct`) you will need to pass a unique ID as a parameter (it can be a product ID, category ID etc.). Others (like `useCart`) do not require an ID passed. You can always check a composable signature in the [API Reference](../core/api-reference/core).

## Anatomy of a composable

Every Vue Storefront composable usually returns three main pieces:

- **Main data object**. A read-only object that represents data returned by the composable. For example, in `useProduct` it's a `products` object, in `useCategory` it's `categories` etc.
- **Supportive data objects**. These properties depend directly or indirectly on the main data object. For example, `loading`, `error` or `isAuthenticated` from `useUser` depend on a `user`.
- **Main function that interacts with data object**. This function usually calls the API and updates the main data object. For example in `useProduct` and `useCategory` it's a `search` method,in `useCart` it's a `load` method. The rule of thumb here is to use `search` when you need to pass some search parameters. `load` is usually called when you need to load some content based on cookies or `localStorage`

```js
import { useProduct } from '{INTEGRATION}';

const { products, search, loading } = useProduct();

search({ slug: 'super-t-shirt' });

return { products, search, loading };
```

### Using `onSSR` for server-side rendering

By default, Vue Storefront supports conveying server-side data to the client with Nuxt.js 2 where `setup` function is synchronous. Because of that, we can't use asynchronous functions if their results depend on each other (e.g. by loading `products` using `id` of a category that you have to fetch first).

To solve this issue, we provide a temporary solution - `onSSR`:

```js
import { useProduct, useCategory } from '{INTEGRATION}';
import { onSSR } from '@vue-storefront/core';

export default {
  setup() {
    const { categories, search: searchCategory } = useCategory();
    const { products, search: searchProduct, loading } = useProduct();

    onSSR(async () => {
      await searchCategory({ slug: 'my-category' });
      await searchProduct({ catId: categories.value[0].id });
    });

    return {
      products,
      loading
    };
  }
};
```

`onSSR` accepts a callback where we should call our `search` or `load` method asynchronously. This will change `loading` state to `true`. Once the API call is done, main data object (`products` in this case) will be populated with the result, and `loading` will become `false` again.

In the future, Vue 3 will provide an async setup and `onSSR` won't be needed anymore.

## What composables I can use

Vue Storefront integrations are exposing the following composables:

#### Product Catalog

- [`useProduct`](../core/api-reference/core.useproduct) - Managing a single product with variants (or a list).
- [`useCategory`](../core/api-reference/core.usecategory) - Managing category lists (but not category products).
- [`useFacet`](../core/api-reference/core.usefacet) - Complex catalog search with filtering.
- [`useReview`](../core/api-reference/core.usereview) - Product reviews.

#### User Profile and Authorization

- [`useUser`](../core/api-reference/core.useuser) - Managing user sessions, credentials and registration.
- [`useUserShipping`](../core/api-reference/core.useusershipping) - Managing shipping addresses.
- [`useUserBilling`](../core/api-reference/core.useuserbilling) - Managing billing addresses.
- [`useUserOrder`](../core/api-reference/core.useuserorder) - Managing past and active user orders.

#### Shopping Cart

- [`useCart`](../core/api-reference/core.usecart) - Loading the cart, adding/removing products and discounts.

#### Wishlist/Favourite

- [`useWishlist`](../core/api-reference/core.usewishlist) - Loading the wishlist, adding/removing products.

#### CMS Content

- [`useContent`](../core/api-reference/core.usecontent) - Fetching the CMS content. It is usually used in combination with `<RenderContent>`component.

#### Checkout

- [`useShipping`](../core/api-reference/core.useshipping) - Saving the shipping address for a current order.
- [`useShippingProvider`](../core/api-reference/core.useshippingprovider) - Choosing a shipping method for a current order. Shares data with `VsfShippingProvider` component.
- [`useBilling`](../core/api-reference/core.usebilling) - Saving the billing address for a current order.
- `usePaymentProvider` - Choosing a payment method for a current order. Shares data with `VsfPaymentProvider` component
- [`useMakeOrder`](../core/api-reference/core.usemakeorder) - Placing the order.

#### Other

- [`useVSFContext`](../core/api-reference/core.usevsfcontext) - Accessing the integration API methods and client instances.
In a real-world application, these composables will most likely use different backend services under the hood yet still leverage the same frontend API. For instance within the same application `useProduct` and `useCategory` could use `commercetools`, `useCart` some ERP system, `useFacet` - Algolia etc.
