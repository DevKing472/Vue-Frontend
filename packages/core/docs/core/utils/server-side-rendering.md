# Server-side rendering

Sometimes our composables need to load some data and share that state between the client and the server-side.
We provide our custom mechanism to create server-side rendered pages used with composables functions.

## Usage

In most cases, the composable functions provide SSR support (it is always transparent for the developer).
To build that composable, you have to create a new composable factory using `useSSR` function.

```js
import { useSSR } from '@vue-storefront/core';

const useCategory = (cacheId) => {
  const { initialState, saveToInitialState} = useSSR(cacheId);
  const categories = ref(initialState || []);

  const search = async (params) => {
    categories.value = await factoryParams.categorySearch(params);
    saveToInitialState(categories.value )
  };

  return {
    search,
    categories: computed(() => categories.value)
  };
};
```

The `useSSR` returns `initialState` field that keeps the shared state between client-side and server-side under the key you provided as an argument to the created composable (`cacheId`). `saveToInitialState` function populates loaded data into the cache. Now created factory supports SSR.

## Your own SSR implementation

It's possible to create your own implementation of shared-state. In that case, you have to provide a custom implementation of the `useSSR`.

```js
import { configureSSR } from '@vue-storefront/core';

configureSSR({
  useSSR: (id: string) => {
    const initialState = {}; // persisted cache

    const saveToInitialState = (value: any) => {
      // saving loaded data
    };

    return {
      initialState,
      saveToInitialState
    };
  }
});
```

## Temporary solution

By default, we do support SSR and shared-state using Nuxt features. Furthermore, we can't use multiple async calls in the setup function that depend on each other (e.g., loading products by the id of the category you have to fetch first). To solve this problem, we provide a temporary solution - `onSSR`.

in your theme:

```js
import { useExample } from 'your/integration/composables';
import { onSSR } from '@vue-storefront/core';

export default {
  setup() {
    const { search: searchOne, exampleOne } = useExample('examples-page1');
    const { search: searchTwo, exampleTwo } = useExample('examples-page2');

    onSSR(async () => {
      await searchOne();
      await searchTwo(exampleOne.id);
    })

    return {
      examples
    }
  }
}

```

In the future, Vue 3 will provide an async setup and `onSSR` won't be needed anymore:

```js
import { useExample } from 'your/integration/composables';
import { onSSR } from '@vue-storefront/core';

export default {
  async setup() {
    const { search: searchOne, exampleOne } = useExample('examples-page1');
    const { search: searchTwo, exampleTwo } = useExample('examples-page2');

    await searchOne();
    await searchTwo(exampleOne.id);

    return {
      examples
    }
  }
}

```