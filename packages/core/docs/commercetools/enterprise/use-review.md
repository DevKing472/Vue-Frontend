---
platform: Commercetools
---

# Reviews

[[toc]]

## Features

`useReview` composition function can be used to:

* fetch:
  * reviews list,
  * average rating,
  * rating distribution (number of reviews per rate).
* submit new reviews.

## API

`useReview` contains following properties:

- `search` - function for fetching review data. When invoked, it requests data from the API and populates `reviews` property.

<Content slot-key="search-params" />

- `addReview` - function for posting new review. When invoked, it submits data to the API and populates `reviews` property with updated information.

<Content slot-key="add-params" />

- `reviews` - reactive data object containing response from the backend.

- `loading` - reactive object containing information about loading state of `search` and `addReview` methods.

- `error` - reactive object containing error message, if `search` or `addReview` failed for any reason.

## Getters

Because `reviews` property is a raw response with some additional properties, it's recommended to use `ReviewGetters` for accessing any data from it. It includes following helper functions:

- `getItems` - returns list of reviews.

- `getTotalReviews` - returns total number of reviews product has.

- `getAverageRating` - returns average rating from all reviews.

- `getRatesCount` - returns rating distribution (number of reviews per rate).

- `getReviewsPage` - returns current page, if results are paginated.

- `getReviewId` - returns unique ID from an individual review item.

- `getReviewAuthor` - returns author name from an individual review item.

- `getReviewMessage` - returns message from an individual review item.

- `getReviewRating` - returns rating from an individual review item.

- `getReviewDate` - returns creation date from an individual review item.

Interface for the above getter looks like this:

```typescript
interface ReviewGetters<REVIEW, REVIEW_ITEM> {
  // Getters for 'review' data object
  getItems: (review: REVIEW) => REVIEW_ITEM[];
  getTotalReviews: (review: REVIEW) => number;
  getAverageRating: (review: REVIEW) => number;
  getRatesCount: (review: REVIEW) => AgnosticRateCount[];
  getReviewsPage: (review: REVIEW) => number;

  // Getters for individual review items
  getReviewId: (item: REVIEW_ITEM) => string;
  getReviewAuthor: (item: REVIEW_ITEM) => string;
  getReviewMessage: (item: REVIEW_ITEM) => string;
  getReviewRating: (item: REVIEW_ITEM) => number;
  getReviewDate: (item: REVIEW_ITEM) => string;
}

interface AgnosticRateCount {
  rate: number;
  count: number;
}
```

## Usage

When you already installed `@vsf-enterprise/ct-reviews` as a dependency, there are few minor modifications required to make it work.

The first step is to add `@vsf-enterprise/ct-reviews` to `build > traspile` array in `nuxt.config.js`:

```javascript
{
    build: {
      transpile: [
        '@vsf-enterprise/ct-reviews'
      ]
    }
}
```

Then we need to replace the import of `useReview` and `reviewGetters` everywhere they are used from `@vue-storefront/commercetools` to `@vsf-enterprise/ct-reviews`:

```javascript
// Before
import { /* other imports */, useReview, reviewGetters } from '@vue-storefront/commercetools';

// After
import { /* other imports */ } from '@vue-storefront/commercetools';
import { useReview, reviewGetters } from '@vsf-enterprise/ct-reviews';
```

## Examples

Fetching reviews for a single product:

```typescript
import { onSSR } from '@vue-storefront/core';
import { useReview, reviewGetters } from '@vsf-enterprise/ct-reviews';

export default {
  setup() {
    const {
      reviews,
      search,
      loading,
      error
    } = useReview('<CACHE_ID>');

    // If you're using Nuxt or any other framework for Universal Vue apps
    onSSR(async () => {
      await search({ productId: '<PRODUCT_ID>' });
    });

    return {
      reviews: computed(() => reviewGetters.getItems(reviews.value)),
      averageRating: computed(() => reviewGetters.getAverageRating(reviews.value)),
      totalReviews: computed(() => reviewGetters.getTotalReviews(reviews.value)),
      loading,
      error
    };
  }
};
```

Providing custom GraphQL query and variables:

```typescript
await search(searchParams, (query, variables) => ({ query, variables }));
await addReview(addParams, (query, variables) => ({ query, variables }));
```

<!---------------------------------------------------- SLOTS ---------------------------------------------------->

<!---------------------- SLOT: search-params ---------------------->
::: slot search-params

```typescript
interface ReviewSearchParams {
  productId: string;
  limit?: number;
  offset?: number;
}
```

:::

<!---------------------- SLOT: add-params ---------------------->
::: slot add-params

```typescript
interface ReviewAddParams {
  productId: string;
  limit?: number;
  offset?: number;
  draft: ReviewDraft;
}

interface ReviewDraft {
  authorName: string;
  text: string;
  rating: number;
}
```

:::
