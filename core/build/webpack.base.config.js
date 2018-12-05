const path = require('path')
const config = require('config')
const fs = require('fs')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const autoprefixer = require('autoprefixer')
const HTMLPlugin = require('html-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack')

fs.writeFileSync(
  path.resolve(__dirname, './config.json'),
  JSON.stringify(config)
)

const themesRoot = '../../src/themes'

const themeRoot = require('./theme-path')
const themeResources = themeRoot + '/resource'
const themeCSS = themeRoot + '/css'
const themeApp = themeRoot + '/App.vue'
const themedIndex = path.join(themeRoot, 'index.template.html')
const themedIndexMinimal = path.join(themeRoot, 'index.minimal.template.html')
const themedIndexBasic = path.join(themeRoot, 'index.basic.template.html')
const themedIndexAmp = path.join(themeRoot, 'index.amp.template.html')

const translationPreprocessor = require('@vue-storefront/i18n/scripts/translation.preprocessor.js')
translationPreprocessor([
  path.resolve(__dirname, '../../node_modules/@vue-storefront/i18n/resource/i18n/'),
  path.resolve(__dirname, themeResources + '/i18n/')
], config)

const postcssConfig =  {
  loader: 'postcss-loader',
  options: {
    ident: 'postcss',
    plugins: (loader) => [
      require('postcss-flexbugs-fixes'),
      require('autoprefixer')({
        flexbox: 'no-2009',
      }),
    ]
  }
};
const isProd = process.env.NODE_ENV === 'production'
// todo: usemultipage-webpack-plugin for multistore
module.exports = {
  plugins: [
    new webpack.ProgressPlugin(),
    // new BundleAnalyzerPlugin(),
    new CaseSensitivePathsPlugin(),
    new VueLoaderPlugin(),
    // generate output HTML
    new HTMLPlugin({
      template: fs.existsSync(themedIndex) ? themedIndex : 'src/index.template.html',
      filename: 'index.html',
      inject: isProd == false // in dev mode we're not using clientManifest therefore renderScripts() is returning empty string and we need to inject scripts using HTMLPlugin
    }),
    new HTMLPlugin({
      template: fs.existsSync(themedIndexMinimal) ? themedIndexMinimal : 'src/index.minimal.template.html',
      filename: 'index.minimal.html',
      inject: isProd == false
    }),
    new HTMLPlugin({
      template: fs.existsSync(themedIndexBasic) ? themedIndexBasic: 'src/index.basic.template.html',
      filename: 'index.basic.html',
      inject: isProd == false
    }),
    new HTMLPlugin({
      template: fs.existsSync(themedIndexAmp) ? themedIndexAmp: 'src/index.amp.template.html',
      filename: 'index.amp.html',
      inject: isProd == false
    })
  ],
  devtool: 'source-map',
  entry: {
    app: './core/client-entry.ts'
  },
  output: {
    path: path.resolve(__dirname, '../../dist'),
    publicPath: '/dist/',
    filename: '[name].[hash].js'
  },
  resolveLoader: {
    modules: [
      'node_modules',
      path.resolve(__dirname, themesRoot)
    ],
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, themesRoot)
    ],
    extensions: ['.js', '.vue', '.gql', '.graphqls', '.ts'],
    alias: {
      // Main aliases
      'config': path.resolve(__dirname, './config.json'),
      'src': path.resolve(__dirname, '../../src'),

      // Theme aliases
      'theme': themeRoot,
      'theme/app': themeApp,
      'theme/css': themeCSS,
      'theme/resource': themeResources
    }
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: [/node_modules/, /test/]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          preserveWhitespace: false,
          postcss: [autoprefixer()],
        }
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/]
        },
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, '../../node_modules/@vue-storefront'),
          path.resolve(__dirname, '../../src'),
          path.resolve(__dirname, '../../core')
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader',
          postcssConfig
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          postcssConfig,
          'sass-loader'
        ]
      },
      {
        test: /\.sass$/,
        use: [
          'vue-style-loader',
          'css-loader',
          postcssConfig,
          {
            loader: 'sass-loader',
            options: {
              indentedSyntax: true
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf)(\?.*$|$)/,
        loader: 'url-loader?importLoaders=1&limit=10000'
      },
      {
        test: /\.(graphqls|gql)$/,
        exclude: /node_modules/,
        loader: ['graphql-tag/loader']
      }
    ]
  }
}
