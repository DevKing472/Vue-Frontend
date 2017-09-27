const fs = require('fs')
const path = require('path')
const express = require('express')
const favicon = require('serve-favicon')
const resolve = file => path.resolve(__dirname, file)

const isProd = process.env.NODE_ENV === 'production'

const app = express()

let renderer
if (isProd) {
  // In production: create server renderer using server bundle and index HTML
  // template from real fs.
  // The server bundle is generated by vue-ssr-webpack-plugin.
  const bundle = require('./dist/vue-ssr-bundle.json')
  // src/index.template.html is processed by html-webpack-plugin to inject
  // build assets and output as dist/index.html.
  const template = fs.readFileSync(resolve('./dist/index.html'), 'utf-8')
  renderer = createRenderer(bundle, template)
} else {
  // In development: setup the dev server with watch and hot-reload,
  // and create a new renderer on bundle / index template update.
  require('./build/dev-server')(app, (bundle, template) => {
    renderer = createRenderer(bundle, template)
  })
}

function createRenderer (bundle, template) {
  // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
  return require('vue-server-renderer').createBundleRenderer(bundle, {
    template,
    cache: require('lru-cache')({
      max: 1000,
      maxAge: 1000 * 60 * 15
    })
  })
}

const serve = (path, cache, options) => express.static(resolve(path), Object.assign({
  maxAge: cache && isProd ? 60 * 60 * 24 * 30 : 0
}, options))

app.use('/dist', serve('./dist', true))
app.use(favicon(path.resolve(__dirname, 'src/assets/logo.png')))
app.use('/service-worker.js', serve('./dist/service-worker.js', {
  setHeaders: {'Content-type': 'application/javascript'}
}))

app.use('/service-worker-ext.js', serve('./dist/service-worker-ext.js', {
  setHeaders: {'Content-type': 'application/javascript'}
}))

app.get('*', (req, res) => {
  if (!renderer) {
    return res.end('waiting for compilation... refresh in a moment.')
  }

  const s = Date.now()

  const errorHandler = err => {
    if (err && err.code === 404) {
      res.status(404).end('404 | Page Not Found')
    } else {
      // Render Error Page or Redirect
      res.status(500).end('500 | Internal Server Error')
      console.error(`error during render : ${req.url}`)
      console.error(err)
    }
  }

  renderer.renderToStream({ url: req.url })
    .on('error', errorHandler)
    .on('end', () => console.log(`whole request: ${Date.now() - s}ms`))
    .pipe(res)
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
