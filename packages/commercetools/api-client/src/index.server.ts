/* istanbul ignore file */
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import * as api from './api';
import { Config, ClientInstance } from './types/setup';
import { createCommerceToolsConnection } from './helpers/commercetoolsLink';
import { defaultSettings } from './helpers/apiClient/defaultSettings';
import { apiClientFactory, ApiClientExtension } from '@vue-storefront/core';

const onCreate = (settings: Config): { config: Config; client: ClientInstance } => {
  const languageMap = settings.languageMap || {};
  const acceptLanguage = settings.acceptLanguage || defaultSettings.acceptLanguage;
  const locale = settings.locale || defaultSettings.locale;

  const config = {
    ...defaultSettings,
    ...settings,
    languageMap,
    acceptLanguage: languageMap[locale] || acceptLanguage,
    auth: settings.auth || defaultSettings.auth
  } as any as Config;

  if (settings.client) {
    return { client: settings.client, config };
  }

  if (settings.customOptions && settings.customOptions.link) {
    return {
      client: new ApolloClient({
        cache: new InMemoryCache(),
        ...settings.customOptions
      }),
      config
    };
  }

  const { apolloLink, sdkAuth, tokenProvider } = createCommerceToolsConnection(config);

  const client = new ApolloClient({
    link: apolloLink,
    cache: new InMemoryCache(),
    ...settings.customOptions
  });
  (client as ClientInstance).sdkAuth = sdkAuth;
  (client as ClientInstance).tokenProvider = tokenProvider;

  return {
    config,
    client
  };
};

const parseToken = (rawToken) => {
  try {
    return JSON.parse(rawToken);
  } catch (e) {
    return null;
  }
};

const getI18nConfig = (req, configuration) => {
  const cookieSettings = configuration.cookies || defaultSettings.cookies;
  const { currencyCookieName, countryCookieName, localeCookieName } = cookieSettings;
  const locale = req.cookies[localeCookieName] || configuration.locale || defaultSettings.locale;
  const currency = req.cookies[currencyCookieName] || configuration.currency || defaultSettings.currency;
  const country = req.cookies[countryCookieName] || configuration.country || defaultSettings.country;

  return { currency, country, locale };
};

const tokenExtension: ApiClientExtension = {
  name: 'tokenExtension',
  hooks: (req, res) => {
    const rawCurrentToken = req.cookies['vsf-commercetools-token'];
    const currentToken = parseToken(rawCurrentToken);

    return {
      beforeCreate: ({ configuration }) => ({
        ...configuration,
        ...getI18nConfig(req, configuration),
        auth: {
          onTokenChange: (newToken) => {
            if (!currentToken || currentToken.access_token !== newToken.access_token) {
              res.cookie(
                'vsf-commercetools-token',
                JSON.stringify(newToken),
                newToken?.expires_at ? { expires: new Date(newToken.expires_at) } : {}
              );
            }
          },

          onTokenRead: () => {
            res.cookie(
              'vsf-commercetools-token',
              rawCurrentToken,
              currentToken?.expires_at ? { expires: new Date(currentToken.expires_at) } : {}
            );
            return currentToken;
          },

          onTokenRemove: () => {
            delete req.cookies['vsf-commercetools-token'];
          }
        }
      })
    };
  }
};

const { createApiClient } = apiClientFactory({
  onCreate,
  api,
  extensions: [tokenExtension]
});

export {
  createApiClient,
  api
};
