const fs = require('fs')
const path = require('path')
const express = require('express')
const compile = require('lodash.template')
const rootPath = require('app-root-path').path
const resolve = file => path.resolve(rootPath, file)

const cache = require('./utils/cache-instance')
const apiStatus = require('./utils/api-status')
const HTMLContent = require('../pages/Compilation')
let config = require('config')

const compileOptions = {
  escape: /{{([^{][\s\S]+?[^}])}}/g,
  interpolate: /{{{([\s\S]+?)}}}/g
}
const NOT_ALLOWED_SSR_EXTENSIONS_REGEX = new RegExp(`(.*)(${config.server.ssrDisabledFor.extensions.join('|')})$`)

const isProd = process.env.NODE_ENV === 'production'
process.noDeprecation = true

const app = express()

function createRenderer (bundle, clientManifest, template) {
  // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
  return require('vue-server-renderer').createBundleRenderer(bundle, {
    clientManifest,
    // runInNewContext: false,
    cache: require('lru-cache')({
      max: 1000,
      maxAge: 1000 * 60 * 15
    })
  })
}

const templatesCache = {}
let renderer
for (const tplName of Object.keys(config.ssr.templates)) {
  const fileName = resolve(config.ssr.templates[tplName])
  if (fs.existsSync(fileName)) {
    const template = fs.readFileSync(fileName, 'utf-8')
    templatesCache[tplName] = compile(template, compileOptions)
  }
}
if (isProd) {
  // In production: create server renderer using server bundle and index HTML
  // template from real fs.
  // The server bundle is generated by vue-ssr-webpack-plugin.
  const clientManifest = require(resolve('dist/vue-ssr-client-manifest.json'))
  const bundle = require(resolve('dist/vue-ssr-bundle.json'))
  // src/index.template.html is processed by html-webpack-plugin to inject
  // build assets and output as dist/index.html.
  // TODO: Add dynamic templates loading from (config based?) list
  renderer = createRenderer(bundle, clientManifest)
} else {
  // In development: setup the dev server with watch and hot-reload,
  // and create a new renderer on bundle / index template update.
  require(resolve('core/build/dev-server'))(app, (bundle, template) => {
    templatesCache['default'] = compile(template, compileOptions) // Important Notice: template switching doesn't work with dev server because of the HMR
    renderer = createRenderer(bundle)
  })
}

function invalidateCache (req, res) {
  if (config.server.useOutputCache) {
    if (req.query.tag && req.query.key) { // clear cache pages for specific query tag
      if (req.query.key !== config.server.invalidateCacheKey) {
        console.error('Invalid cache invalidation key')
        apiStatus(res, 'Invalid cache invalidation key', 500)
        return
      }
      console.log(`Clear cache request for [${req.query.tag}]`)
      let tags = []
      if (req.query.tag === '*') {
        tags = config.server.availableCacheTags
      } else {
        tags = req.query.tag.split(',')
      }
      const subPromises = []
      tags.forEach(tag => {
        if (config.server.availableCacheTags.indexOf(tag) >= 0 || config.server.availableCacheTags.find(t => {
          return tag.indexOf(t) === 0
        })) {
          subPromises.push(cache.invalidate(tag).then(() => {
            console.log(`Tags invalidated successfully for [${tag}]`)
          }))
        } else {
          console.error(`Invalid tag name ${tag}`)
        }
      })
      Promise.all(subPromises).then(r => {
        apiStatus(res, `Tags invalidated successfully [${req.query.tag}]`, 200)
      }).catch(error => {
        apiStatus(res, error, 500)
        console.error(error)
      })
    } else {
      apiStatus(res, 'Invalid parameters for Clear cache request', 500)
      console.error('Invalid parameters for Clear cache request')
    }
  } else {
    apiStatus(res, 'Cache invalidation is not required, output cache is disabled', 200)
  }
}

const serve = (path, cache, options) => express.static(resolve(path), Object.assign({
  maxAge: cache && isProd ? 2592000000 : 0, // 1 month in milliseconds = 1000 * 60 * 60 * 24 * 30 = 2592000000
  fallthrough: false
}, options))

const themeRoot = require('../build/theme-path')

app.use('/dist', serve('dist', true))
app.use('/assets', serve(themeRoot + '/assets', true))
app.use('/service-worker.js', serve('dist/service-worker.js', false, {
  setHeaders: function (res, path, stat) {
    res.set('Content-Type', 'text/javascript; charset=UTF-8')
  }
}))

const serverExtensions = require(resolve('src/server'))
serverExtensions.registerUserServerRoutes(app)

app.post('/invalidate', invalidateCache)

app.get('/invalidate', invalidateCache)

app.get('*', (req, res, next) => {
  if (NOT_ALLOWED_SSR_EXTENSIONS_REGEX.test(req.url)) {
    apiStatus(res, 'Vue Storefront: Resource is not found', 404)
    return
  }

  const s = Date.now()
  const errorHandler = err => {
    if (err && err.code === 404) {
      if (NOT_ALLOWED_SSR_EXTENSIONS_REGEX.test(req.url)) {
        apiStatus(res, 'Vue Storefront: Resource is not found', 404)
        console.error(`Resource is not found : ${req.url}`)
        next()
      } else {
        res.redirect('/page-not-found')
        console.error(`Redirect for resource not found : ${req.url}`)
      }
    } else {
      res.redirect('/error')
      console.error(`Error during render : ${req.url}`)
      console.error(err)
      next()
    }
  }

  const dynamicRequestHandler = renderer => {
    if (!renderer) {
      res.setHeader('Content-Type', 'text/html')
      res.status(202).end(HTMLContent)
      return next()
    }
    const context = {
      url: decodeURI(req.url),
      output: {
        prepend: (context) => { return '' }, // these functions can be replaced in the Vue components to append or prepend some content AFTER all other things are rendered. So in this function You may call: output.prepend() { return context.renderStyles() } to attach styles
        append: (context) => { return '' },
        appendHead: (context) => { return '' },
        template: 'default',
        cacheTags: null
      },
      server: {
        app: app,
        response: res,
        request: req
      },
      meta: null,
      vs: {
        config: config,
        storeCode: req.header('x-vs-store-code') ? req.header('x-vs-store-code') : process.env.STORE_CODE
      }
    }
    renderer.renderToString(context).then(output => {
      if (!res.get('content-type')) {
        res.setHeader('Content-Type', 'text/html')
      }
      let tagsArray = []
      if (config.server.useOutputCacheTagging && context.output.cacheTags !== null) {
        tagsArray = Array.from(context.output.cacheTags)
        const cacheTags = tagsArray.join(' ')
        res.setHeader('X-VS-Cache-Tags', cacheTags)
        console.log(`cache tags for the request: ${cacheTags}`)
      }
      const contentPrepend = (typeof context.output.prepend === 'function') ? context.output.prepend(context) : ''
      const contentAppend = (typeof context.output.append === 'function') ? context.output.append(context) : ''

      output = contentPrepend + output + contentAppend
      if (context.output.template) { // case when we've got the template name back from vue app
        if (!isProd) context.output.template = 'default' // in dev mode we can not use pre-rendered HTML templates
        if (templatesCache[context.output.template]) { // please look at: https://github.com/vuejs/vue/blob/79cabadeace0e01fb63aa9f220f41193c0ca93af/src/server/template-renderer/index.js#L87 for reference
          output = templatesCache[context.output.template](context).replace('<!--vue-ssr-outlet-->', output)
        } else {
          throw new Error(`The given template name ${context.output.template} does not exist`)
        }
      }
      if (config.server.useOutputCache && cache) {
        cache.set(
          'page:' + req.url,
          { headers: res.getHeaders(), body: output },
          tagsArray
        ).catch(errorHandler)
      }
      res.end(output)
      console.log(`whole request [${req.url}]: ${Date.now() - s}ms`)
      next()
    }).catch(errorHandler)
  }

  const dynamicCacheHandler = () => {
    if (config.server.useOutputCache && cache) {
      cache.get(
        'page:' + req.url
      ).then(output => {
        if (output !== null) {
          if (output.headers) {
            for (const header of Object.keys(output.headers)) {
              res.setHeader(header, output.headers[header])
            }
          }
          res.setHeader('X-VS-Cache', 'Hit')
          if (output.body) {
            res.end(output.body)
          } else {
            res.setHeader('Content-Type', 'text/html')
            res.end(output.body)
          }
          res.end(output)
          console.log(`cache hit [${req.url}], cached request: ${Date.now() - s}ms`)
          next()
        } else {
          res.setHeader('Content-Type', 'text/html')
          res.setHeader('X-VS-Cache', 'Miss')
          console.log(`cache miss [${req.url}], request: ${Date.now() - s}ms`)
          dynamicRequestHandler(renderer) // render response
        }
      }).catch(errorHandler)
    } else {
      dynamicRequestHandler(renderer)
    }
  }

  if (config.server.dynamicConfigReload) {
    delete require.cache[require.resolve('config')]
    config = require('config') // reload config
    if (typeof serverExtensions.configProvider === 'function') {
      serverExtensions.configProvider(req).then(loadedConfig => {
        config = Object.assign(config, loadedConfig) // merge loaded conf with build time conf
        dynamicCacheHandler()
      }).catch(error => {
        if (config.server.dynamicConfigContinueOnError) {
          dynamicCacheHandler()
        } else {
          console.log('config provider error:', error)
          if (req.url !== '/error') {
            res.redirect('/error')
          }
          dynamicCacheHandler()
        }
      })
    } else {
      config = require('config') // reload config
      dynamicCacheHandler()
    }
  } else {
    dynamicCacheHandler()
  }
})

let port = process.env.PORT || config.server.port
const host = process.env.HOST || config.server.host
const start = () => {
  app.listen(port, host)
    .on('listening', () => {
      console.log(`Vue Storefront Server started at http://${host}:${port}`)
    })
    .on('error', (e) => {
      if (e.code === 'EADDRINUSE') {
        port = parseInt(port) + 1
        console.log(`The port is already in use, trying ${port}`)
        start()
      }
    })
}
start()
