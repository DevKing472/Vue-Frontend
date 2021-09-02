import consola from 'consola';
import { Express } from 'express';
import {
  Integration,
  ApiClientFactory,
  ApiClientExtension,
  IntegrationsSection,
  CustomQuery
} from '@vue-storefront/core';

interface IntegrationLoaded {
  apiClient: ApiClientFactory;
  configuration: any;
  extensions: ApiClientExtension[];
  customQueries?: Record<string, CustomQuery>
}

type IntegrationsLoaded = Record<string, IntegrationLoaded>

const createRawExtensions = (apiClient: ApiClientFactory, integration: Integration): ApiClientExtension[] => {
  const extensionsCreateFn = integration.extensions;
  const predefinedExtensions = (apiClient.createApiClient as any)._predefinedExtensions;
  return extensionsCreateFn ? extensionsCreateFn(predefinedExtensions) : predefinedExtensions;
};

const lookUpExternal = (curr: string | ApiClientExtension): ApiClientExtension[] =>
  // eslint-disable-next-line global-require
  typeof curr === 'string' ? require(curr) : [curr];

const createExtensions = (rawExtensions: ApiClientExtension[]): ApiClientExtension[] => rawExtensions
  .reduce((prev, curr) => [...prev, ...lookUpExternal(curr)], []);

const registerIntegrations = (app: Express, integrations: IntegrationsSection): IntegrationsLoaded =>
  Object.entries<Integration>(integrations).reduce((prev, [tag, integration]) => {
    consola.info(`- Loading: ${tag} ${integration.location}`);

    // eslint-disable-next-line global-require
    const apiClient: ApiClientFactory = require(integration.location);
    const rawExtensions: ApiClientExtension[] = createRawExtensions(apiClient, integration);
    const extensions: ApiClientExtension[] = createExtensions(rawExtensions);

    extensions.forEach(({ name, extendApp }) => {
      consola.info(`- Loading: ${tag} extension: ${name}`);

      if (extendApp) {
        extendApp({ app, configuration: integration.configuration });
      }
    });

    consola.success(`- Integration: ${tag} loaded!`);

    return {
      ...prev,
      [tag]: {
        apiClient,
        extensions,
        configuration: integration.configuration,
        customQueries: integration.customQueries
      }
    };
  }, {});

export { registerIntegrations };
