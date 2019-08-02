const fs = require('fs')
const path = require('path')
const compile = require('lodash.template')
const rootPath = require('app-root-path').path
const resolve = file => path.resolve(rootPath, file)

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

function applyAdvancedOutputProcessing (context, output, templatesCache, isProd = true, relatvePaths = false, destDir = '', outputFilename = '') {
  const contentPrepend = (typeof context.output.prepend === 'function') ? context.output.prepend(context) : '';
  const contentAppend = (typeof context.output.append === 'function') ? context.output.append(context) : '';
  output = contentPrepend + output + contentAppend;
  if (context.output.template) { // case when we've got the template name back from vue app
    if (!isProd) { context.output.template = 'default'; } // in dev mode we can not use pre-rendered HTML templates
    if (templatesCache[context.output.template]) { // please look at: https://github.com/vuejs/vue/blob/79cabadeace0e01fb63aa9f220f41193c0ca93af/src/server/template-renderer/index.js#L87 for reference
      output = templatesCache[context.output.template](context).replace('<!--vue-ssr-outlet-->', output);
    } else {
      throw new Error(`The given template name ${context.output.template} does not exist`);
    }
  }
  if (relatvePaths) {
    const relativePath = path.relative(outputFilename, destDir).replace('../', '')
    output = output.replace(new RegExp('/dist', 'g'), `${relativePath}/dist`)
    output = output.replace(new RegExp('/assets', 'g'), `${relativePath}/dist`)
    output = output.replace(new RegExp('href="/', 'g'), `href="${relativePath}/`)
  }
  return output;
}

function initTemplatesCache (config, compileOptions) {
  const templatesCache = {}
  for (const tplName of Object.keys(config.ssr.templates)) {
    const fileName = resolve(config.ssr.templates[tplName]);
    if (fs.existsSync(fileName)) {
      const template = fs.readFileSync(fileName, 'utf-8');
      templatesCache[tplName] = compile(template, compileOptions);
    }
  }
  return templatesCache
}

function initSSRRequestContext (app, req, res, config) {
  return {
    url: decodeURI(req.url),
    output: {
      prepend: (context) => { return ''; },
      append: (context) => { return ''; },
      appendHead: (context) => { return ''; },
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
      storeCode: typeof req.header === 'function' ? (req.header('x-vs-store-code') ? req.header('x-vs-store-code') : process.env.STORE_CODE) : process.env.STORE_CODE
    }
  };
}

module.exports = {
  createRenderer,
  initTemplatesCache,
  initSSRRequestContext,
  applyAdvancedOutputProcessing,
  compileTemplate: compile
}
