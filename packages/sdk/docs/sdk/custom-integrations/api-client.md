# Creating an API Client

:::warning
This section covers how to create an API client for server-to-server communication. If you're looking for a ready-to-use integration, please check out the [Modules](../modules/index.md) section.
:::

The API client is used by the server middleware to create a server-to-server communication with your custom backend.

## Creating the integration client

To start, create a new folder called `api-client` in the `src` folder of your integration. This package will contain your integration API client.

First, you should create the `index.server.ts` file. It will be the entry point for the server middleware. It should look like this:

```ts
// index.server.ts
import { apiClientFactory } from '@vue-storefront/middleware';

const onCreate = (settings: any) => {
  // TODO: create a client here and return it with the integration configuration
};

const { createApiClient } = apiClientFactory({
  onCreate,
  api: {},
});

export { createApiClient };
```

The `apiClientFactory` is a function that creates a factory for creating API clients.

The `onCreate` function is called when the server middleware is initialized. It should return an object with the integration configuration and the client.

The `api` object is a set of functions that will be available in the integration client.

Now, let's create the client. 

:::tip
In the following example we used the `axios` library to create a client. However, you can use any client that you suits your needs.
:::

The `buildClient` function creates an instance of the `axios` client. It's a good practice to create a separate function for creating the client, so you can easily mock it in the tests.

The `onCreate` function returns accepts the integration configuration, and we recommend that you create an interface for it.

```ts
// types/config/index.ts

/**
 * Settings to be provided in the `middleware.config.js` file.
 */
export interface MiddlewareConfig {
  // Add the fields provided in the `middleware.config.js` file.
}
```

You should use the `MiddlewareConfig` interface in the `onCreate` function.

```ts
// index.server.ts
import { apiClientFactory } from '@vue-storefront/middleware';
import axios from 'axios';
import { MiddlewareConfig } from './types/config';

const buildClient = () => {
  const axiosInstance = axios.create();
  return axiosInstance;
};

const onCreate = (settings: MiddlewareConfig) => {
  const client = buildClient();

  return {
    config: settings,
    client,
  };
};

const { createApiClient } = apiClientFactory({
  onCreate,
  api: {},
});

export { createApiClient };
```

The server middleware can be initialized now, but it does not contain any API functions. Before adding them, let's type the integration context. Vue Storefront uses the `context` object to pass the integration client and the configuration to the API functions. Create a `types/context/index.ts` file and add the following code:

```ts
// types/context/index.ts
import { IntegrationContext } from '@vue-storefront/middleware';
import { AxiosInstance } from 'axios';
import { MiddlewareConfig } from '../config';

/**
 * All available API Endpoints without first argument - `context`, because this prop is set automatically.
 */
export type ContextualizedEndpoints = {
  [T in keyof Endpoints]: Endpoints[T] extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;
};

/**
 * Runtime integration context, which includes API client instance, settings, and endpoints that will be passed via middleware server.
 * This interface name is starting with `MyIntegration`, but you should use your integration name in here.
 **/
export type MyIntegrationIntegrationContext = IntegrationContext<
  AxiosInstance, // HTTP client instance
  MiddlewareConfig,
  ContextualizedEndpoints
>;

/**
 * Global context of the application which includes runtime integration context.
 **/
export interface Context {
  // This property is named `myIntegration`, but you should use your integration name in here.
  $myIntegration: MyIntegrationIntegrationContext;
}
```

The `ContextualizedEndpoints` type is a set of API functions without the `context` argument. It's necessary for the `IntegrationContext` type. It also requires the type of client used in the integration and the type of integration configuration.

The `Context` type is the global context of the application. It's used by api-client methods to access the integration client and the configuration.

Now you can add the interface for the API functions.

```ts
// types/api/index.ts
import { MyIntegrationContext } from '../config';

type TODO = any;

/**
 * Definition of all API-client methods available in {@link https://docs.vuestorefront.io/v2/advanced/context.html#context-api | context}.
 */
export interface Endpoints {
  /**
   * Here you can find an example endpoint definition. Based on this example, you should define how your endpoint will look like.
   * This description will appear in the API extractor, so try to document all endpoints added here.
   */
  exampleEndpoint: (context: MyIntegrationContext, params: TODO) => Promise<TODO>;
}
```

Finally, you can create the `exampleEndpoint` function.

```ts
// api/exampleEndpoint/index.ts
import { Endpoints } from '../../types';

export const exampleEndpoint: Endpoints['exampleEndpoint'] = async (context, params) => {
  console.log('exampleEndpoint has been called');

  // Example request could look like this:
  // return await context.client.get(`example-url?id=${params.id}`);
  return Promise.resolve({ success: true });
};
```

You should also export the `exampleEndpoint` function in the `api/index.ts` file.

```ts
// api/index.ts
export * from './exampleEndpoint';
```

To be able to call the `exampleEndpoint` function, you should add it to the `api` object in the `index.server.ts` file.

```ts
import { apiClientFactory } from '@vue-storefront/middleware';
import axios from 'axios';
import * as api from './api';
import { MiddlewareConfig } from './types/config';

const buildClient = () => {
  const axiosInstance = axios.create();
  return axiosInstance;
};

const onCreate = (settings: MiddlewareConfig) => {
  const client = buildClient();

  return {
    config: settings,
    client,
  };
};

const { createApiClient } = apiClientFactory({
  onCreate,
  api,
});

export { createApiClient };
```

## Running the integration

Your integration is ready to use. You can test it by setting up the `middleware.config.js` file and running the middleware

:::warning Building your integration
This guide described the details of creating the integration, but it does not cover the details of the building process. You can find the tools and configuration we use by default in our integrations in our [integration boilerplate repository](https://github.com/vuestorefront/integration-boilerplate)
:::

```js
// middleware.config.js

module.exports = {
  integrations: {
    boilerplate: {
      location: '@vsf-enterprise/my-integration-api/server', // This should be the path to your built index.server.js file
      configuration: {
        // Add your configuration here
      },
    },
  },
};
```

You can run the server middleware with this example script:

```js
// server.js
const { createServer } = require('@vue-storefront/middleware');
const { integrations } = require('./middleware.config');
const cors = require('cors');

(async () => {
  const app = await createServer({ integrations });
  const host = process.argv[2] ?? '0.0.0.0';
  const port = process.argv[3] ?? 8181;
  const CORS_MIDDLEWARE_NAME = 'corsMiddleware';

  const corsMiddleware = app._router.stack.find((middleware) => middleware.name === CORS_MIDDLEWARE_NAME);

  corsMiddleware.handle = cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  app.listen(port, host, () => {
    console.log(`Middleware started: ${host}:${port}`);
  });
})();
```

To run the middleware, you should run the following command:

```bash
node server.js
```

To call the endpoint, simply run a `POST` request to the `http://localhost:8181/myIntegration/exampleEndpoint` endpoint.
