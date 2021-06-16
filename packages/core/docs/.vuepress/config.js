module.exports = {
  title: 'Vue Storefront 2',
  base: '/v2/',
  description: 'Vue Storefront 2 documentation',
  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }],

    //HubSpot
    ['script', { async: true, defer: true, src: 'https://js.hs-scripts.com/8443671.js', id: 'hs-script-loader' }],

    // Google Analytics
    ['script', { async: true, src: 'https://www.googletagmanager.com/gtag/js?id=G-12MM6R3MDK' }],
    ['script', {}, ['window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag("js", new Date());gtag("config", "G-12MM6R3MDK");']],
  ],
  configureWebpack: (config) => {
    config.module.rules = config.module.rules.map((rule) => ({
      ...rule,
      use:
        rule.use &&
        rule.use.map((useRule) => ({
          ...useRule,
          options:
            useRule.loader === 'url-loader'
              ? /**
					  Hack for loading images properly.
					  ref: https://github.com/vuejs/vue-loader/issues/1612#issuecomment-559366730
					 */
                { ...useRule.options, esModule: false }
              : useRule.options
        }))
    }));
  },
  themeConfig: {
    logo:
      'https://camo.githubusercontent.com/48c886ac0703e3a46bc0ec963e20f126337229fc/68747470733a2f2f643968687267346d6e767a6f772e636c6f756466726f6e742e6e65742f7777772e76756573746f726566726f6e742e696f2f32383062313964302d6c6f676f2d76735f3062793032633062793032633030303030302e6a7067',
    nav: [
      { text: 'Demo', link: 'https://vsf-next-demo.storefrontcloud.io' },
      { text: 'Integrations', link: '/integrations/' },
      { text: 'Migration guide', link: '/migrate/' },
      {
        text: 'Roadmap',
        link:
          'https://www.notion.so/vuestorefront/Vue-Storefront-2-Next-High-level-Roadmap-201cf06abb314b84ad01b7b8463c0437'
      }
    ],
    sidebar: {
      '/migrate/': [
        {
          title: 'Migration guide 2.3.0',
          children: [
            ['/migrate/2.3.0/overview', 'Overview'],
            ['/migrate/2.3.0/integrators', 'Integrators'],
            ['/migrate/2.3.0/commercetools', 'commercetools']
          ]
        },
        {
          title: 'Migration guide 2.3.0-rc.3',
          children: [
            ['/migrate/2.3.0-rc.3/overview', 'Overview'],
            ['/migrate/2.3.0-rc.3/integrators', 'Integrators'],
            ['/migrate/2.3.0-rc.3/commercetools', 'commercetools']
          ]
        },
        {
          title: 'Migration guide 2.3.0-rc.2',
          children: [
            ['/migrate/2.3.0-rc.2/overview', 'Overview'],
            ['/migrate/2.3.0-rc.2/integrators', 'Integrators'],
            ['/migrate/2.3.0-rc.2/commercetools', 'commercetools']
          ]
        },
        {
          title: 'Migration guide 2.2.0',
          children: [
            ['/migrate/2.2.0/overview', 'Overview'],
            ['/migrate/2.2.0/integrators', 'Integrators'],
            ['/migrate/2.2.0/projects', 'Projects']
          ]
        },
        {
          title: 'Migration guide 2.1.0-rc.1',
          children: [
            ['/migrate/2.1.0-rc.1/overview', 'Overview'],
            ['/migrate/2.1.0-rc.1/integrators', 'Integrators'],
            ['/migrate/2.1.0-rc.1/projects', 'Projects']
          ]
        }
      ],
      '/commercetools/': [
        {
          title: 'Essentials',
          collapsable: false,
          children: [
            ['/commercetools/', 'Introduction'],
            ['/commercetools/getting-started', 'Getting started'],
            ['/commercetools/configuration', 'Configuration'],
            ['/commercetools/authorization-strategy', 'Authorization'],
            ['/enterprise/feature-list', 'Feature list'],
            ['/commercetools/maintainers', 'Maintainers and support'],
            ['/commercetools/changelog', 'Changelog']
          ]
        },
        {
          title: 'Composables',
          collapsable: false,
          children: [
            ['/commercetools/composables/use-product', 'useProduct'],
            ['/commercetools/composables/use-review', 'useReview '],
            ['/commercetools/composables/use-user', 'useUser'],
            ['/commercetools/composables/use-user-shipping', 'useUserShipping'],
            ['/commercetools/composables/use-user-billing', 'useUserBilling'],
            ['/commercetools/composables/use-user-order', 'useUserOrder'],
            ['/commercetools/composables/use-facet', 'useFacet'],
            ['/commercetools/composables/use-cart', 'useCart'],
            ['/commercetools/composables/use-wishlist', 'useWishlist'],
            ['/commercetools/composables/use-category', 'useCategory'],
            ['/commercetools/composables/use-shipping', 'useShipping'],
            [
              '/commercetools/composables/use-shipping-provider',
              'useShippingProvider'
            ],
            ['/commercetools/composables/use-billing', 'useBilling'],
            ['/commercetools/composables/use-make-order', 'useMakeOrder']
          ]
        },
        {
          title: 'API Client',
          collapsable: false,
          children: [
            ['/commercetools/api-client-reference', 'Methods reference']
          ]
        },
        {
          title: 'Extensions',
          collapsable: false,
          children: [['/commercetools/extensions/user-groups', 'User groups']]
        },
        {
          title: 'Theme',
          collapsable: false,
          children: [['/commercetools/auth-middleware', 'Auth Middleware']]
        }
      ],
      '/aboutyou/': [
        {
          title: 'Essentials',
          collapsable: false,
          children: [
            ['/aboutyou/', 'Introduction'],
            ['/aboutyou/getting-started', 'Getting Started'],
            ['/aboutyou/api-client', 'API Client'],
            ['/aboutyou/composables', 'Composables'],
            ['/aboutyou/feature-list', 'Feature list']
          ]
        },
        {
          title: 'Composables',
          collapsable: false,
          children: [
            ['/aboutyou/use-cart', 'useCart'],
            ['/aboutyou/use-product', 'useProduct'],
            ['/aboutyou/use-wishlist', 'useWishlist']
          ]
        }
      ],
      '/shopify/': [
        {
          title: 'Essentials',
          collapsable: false,
          children: [
            ['/shopify/', 'Introduction'],
            ['/shopify/getting-started', 'Getting Started'],
            ['/shopify/configuration', 'Configuration'],
            ['/shopify/feature-list', 'Feature list'],
            ['/shopify/maintainers', 'Maintainers and support']
          ]
        },
        {
          title: 'Composables',
          collapsable: false,
          children: [
            ['/shopify/use-cart', 'useCart'],
            ['/shopify/use-category', 'useCategory'],
            ['/shopify/use-content', 'useContent'],
            ['/shopify/use-product', 'useProduct'],
            ['/shopify/use-search', 'useSearch'],
            ['/shopify/use-user', 'useUser'],
            ['/shopify/use-user-order', 'useUserOrders']
          ]
        },
        {
          title: 'Other',
          collapsable: false,
          children: [['/shopify/checkout', 'Checkout']]
        }
      ],
      '/': [
        {
          title: 'Getting started',
          collapsable: false,
          children: [
            ['/', 'Introduction'],
            ['/general/installation', 'Installation'],
            ['/general/key-concepts', 'Key concepts'],
            ['/general/enterprise', 'Enterprise']
          ]
        },
        {
          title: 'Guides',
          collapsable: false,
          children: [
            ['/guide/theme', 'Theme'],
            ['/guide/configuration', 'Configuration'],
            ['/guide/composables', 'Composables'],
            ['/guide/getters', 'Getters'],
            ['/guide/product-catalog', 'Product Catalog'],
            ['/guide/authentication', 'Authentication'],
            ['/guide/user-profile', 'User profile'],
            ['/guide/cart-and-wishlist', 'Cart and wishlist'],
            ['/guide/checkout', 'Checkout']
          ]
        },
        {
          title: 'Advanced',
          collapsable: false,
          children: [
            ['/advanced/architecture', 'Architecture'],
            ['/advanced/context', 'Application Context'],
            ['/advanced/calling-platform-api', 'Calling Platform API'],
            ['/advanced/extending-graphql-queries', 'Extending GraphQL Queries'],
            ['/advanced/server-middleware', 'Server Middleware'],
            ['/advanced/internationalization', 'Internationalization'],
            ['/advanced/performance', 'Performance'],
            ['/advanced/ssr-cache', 'SSR Cache'],
            ['/advanced/logging', 'Logging'],
            ['/core/api-reference/', 'API Reference']
          ]
        },
        {
          title: 'Building integration',
          collapsable: true,
          children: [
            ['/integrate/integration-guide', 'eCommerce'],
            ['/integrate/cms', 'CMS'],
            ['/integrate/cache-driver', 'Cache driver']
          ]
        },
        {
          title: 'Contributing',
          collapsable: true,
          children: [
            ['/contributing/', 'Contributing'],
            ['/contributing/api-design-philosophy', 'Rules and conventions'],
            ['/contributing/creating-changelog', 'Creating changelog'],
            ['/contributing/themes', 'Working with themes'],
            ['/contributing/server-side-rendering', 'Server-side rendering'],
            ['/contributing/changelog', 'Core Changelog']
          ]
        }
      ]
    }
  }
};
