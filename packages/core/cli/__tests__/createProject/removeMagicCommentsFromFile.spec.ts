import removeMagicCommentsFromFile from '../../src/scripts/createProject/removeMagicCommentsFromFile';

const fileContent = `
import webpack from 'webpack';
import { config } from './plugins/commercetools-config.js';

const localeNames = config.locales.map(l => ({ code: l.name, file: 'abc.js', iso: l.name }));

export default {
  mode: 'universal',
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport',
        content: 'width=device-width, initial-scale=1' },
      { hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico' }
    ]
  },
  loading: { color: '#fff' },
  plugins: [
    './plugins/commercetools.js'
  ],
  router: {
    middleware: ['commercetools', 'checkout']
  },
  buildModules: [
    // to core
    '@nuxt/typescript-build',
    ['@vue-storefront/nuxt', {
      // @core-development-only-start
      coreDevelopment: true,
      // @core-development-only-end
      useRawSource: {
        dev: [
          '@vue-storefront/commercetools',
          '@vue-storefront/core'
        ],
        prod: [
          '@vue-storefront/commercetools',
          '@vue-storefront/core'
        ]
      }
    }],
    // @core-development-only-start
    ['@vue-storefront/nuxt-theme', {
      apiClient: '@vue-storefront/commercetools-api',
      composables: '@vue-storefront/commercetools'
    }]
    // @core-development-only-end
  ],
  modules: [
    'nuxt-i18n',
    'cookie-universal-nuxt',
    'vue-scrollto/nuxt'
  ],
  build: {
    transpile: [
      'vee-validate/dist/rules'
    ],
    plugins: [
      new webpack.DefinePlugin({
        'process.VERSION': JSON.stringify({
          // eslint-disable-next-line global-require
          version: require('./package.json').version,
          lastCommit: process.env.LAST_COMMIT || ''
        })
      })
    ]
  },
  i18n: {
    locales: localeNames,
    defaultLocale: localeNames[0].code,
    lazy: true,
    seo: true,
    langDir: 'lang/',
    vueI18n: {
      fallbackLocale: localeNames[0].code
    },
    detectBrowserLanguage: {
      cookieKey: config.cookies.localeCookieName,
      alwaysRedirect: true
    }
  }
};

`;

jest.mock('fs', () => ({
  readFileSync: () => fileContent,
  writeFileSync: jest.fn()
}));

import { writeFileSync } from 'fs';

describe('[vsf-next-cli] removeMagicCommentsFromFile', () => {
  it('removes magic comments from the file', () => {

    const absoluteFilePath = 'nuxt.config.js';

    // I removed magic comments in the const below
    const expectedFileContent = `
import webpack from 'webpack';
import { config } from './plugins/commercetools-config.js';

const localeNames = config.locales.map(l => ({ code: l.name, file: 'abc.js', iso: l.name }));

export default {
  mode: 'universal',
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport',
        content: 'width=device-width, initial-scale=1' },
      { hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico' }
    ]
  },
  loading: { color: '#fff' },
  plugins: [
    './plugins/commercetools.js'
  ],
  router: {
    middleware: ['commercetools', 'checkout']
  },
  buildModules: [
    // to core
    '@nuxt/typescript-build',
    ['@vue-storefront/nuxt', {
      useRawSource: {
        dev: [
          '@vue-storefront/commercetools',
          '@vue-storefront/core'
        ],
        prod: [
          '@vue-storefront/commercetools',
          '@vue-storefront/core'
        ]
      }
    }],
  ],
  modules: [
    'nuxt-i18n',
    'cookie-universal-nuxt',
    'vue-scrollto/nuxt'
  ],
  build: {
    transpile: [
      'vee-validate/dist/rules'
    ],
    plugins: [
      new webpack.DefinePlugin({
        'process.VERSION': JSON.stringify({
          // eslint-disable-next-line global-require
          version: require('./package.json').version,
          lastCommit: process.env.LAST_COMMIT || ''
        })
      })
    ]
  },
  i18n: {
    locales: localeNames,
    defaultLocale: localeNames[0].code,
    lazy: true,
    seo: true,
    langDir: 'lang/',
    vueI18n: {
      fallbackLocale: localeNames[0].code
    },
    detectBrowserLanguage: {
      cookieKey: config.cookies.localeCookieName,
      alwaysRedirect: true
    }
  }
};

`;
    removeMagicCommentsFromFile(absoluteFilePath);

    expect(writeFileSync).toHaveBeenCalledWith(absoluteFilePath, expectedFileContent);

  });
});
