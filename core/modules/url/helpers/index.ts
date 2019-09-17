import { router } from '@vue-storefront/core/app'
import config from 'config'
import { localizedDispatcherRoute, localizedRoute, LocalizedRoute } from '@vue-storefront/core/lib/multistore'
import { RouteConfig } from 'vue-router/types/router';
import { RouterManager } from '@vue-storefront/core/lib/router-manager'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { Category } from 'core/modules/catalog-next/types/Category'
import { removeStoreCodeFromRoute } from '@vue-storefront/core/lib/multistore'
import { isServer } from '@vue-storefront/core/helpers'

export function parametrizeRouteData (routeData: LocalizedRoute, query: { [id: string]: any } | string, storeCodeInPath: string): LocalizedRoute {
  const parametrizedRoute = Object.assign({}, routeData)
  parametrizedRoute.params = Object.assign({}, parametrizedRoute.params || {}, query)
  if (storeCodeInPath && !parametrizedRoute.name.startsWith(storeCodeInPath + '-')) {
    parametrizedRoute.name = storeCodeInPath + '-' + parametrizedRoute.name
  }
  return parametrizedRoute
}

function prepareDynamicRoute (routeData: LocalizedRoute, path: string, addToRoutes: boolean = true): RouteConfig[] {
  const rootPath = removeStoreCodeFromRoute(path) as string
  const userRoute = RouterManager.findByName(routeData.name)
  if (userRoute) {
    if (addToRoutes) {
      const routes = []
      const rootDynamicRoute = Object.assign({}, userRoute, routeData, { path: '/' + rootPath, name: `urldispatcher-${rootPath}` })
      const isMultistore = config.storeViews.multistore === true && config.storeViews.mapStoreUrlsFor.length > 0
      if (isServer) {
        routes.push(rootDynamicRoute)
        if (isMultistore) {
          for (let storeCode of config.storeViews.mapStoreUrlsFor) {
            if (storeCode) {
              routes.push(localizedDynamicRoute(routeData, userRoute, rootPath, storeCode))
            }
          }
        }
      } else {
        const { storeCode } = currentStoreView()
        if (isMultistore && storeCode) {
          routes.push(localizedDynamicRoute(routeData, userRoute, rootPath, storeCode))
        } else {
          routes.push(rootDynamicRoute)
        }
      }
      return routes
    } else {
      const dynamicRoute = Object.assign({}, userRoute, routeData, { path: '/' + path, name: `urldispatcher-${path}` })
      return [dynamicRoute]
    }
  } else {
    return []
  }
}

function localizedDynamicRoute (routeData: LocalizedRoute, userRoute: RouteConfig, rootPath: string, storeCode: string) {
  const multistorePath = '/' + ((config.defaultStoreCode !== storeCode && config.storeViews[storeCode].appendStoreCode) ? (storeCode + '/') : '') + rootPath
  return Object.assign({}, userRoute, routeData, { path: multistorePath, name: `urldispatcher-${rootPath}-${storeCode}` })
}

export function processDynamicRoute (routeData: LocalizedRoute, path: string, addToRoutes: boolean = true): LocalizedRoute[] {
  const preparedRoutes = prepareDynamicRoute(routeData, path, addToRoutes)
  if (addToRoutes && preparedRoutes) {
    RouterManager.addRoutes(preparedRoutes, router, true)
  }
  return preparedRoutes
}

export function preProcessDynamicRoutes (dispatcherMap: {}, addToRoutes: boolean = true): LocalizedRoute[] {
  const preparedRoutes = []
  for (const [url, routeData] of Object.entries(dispatcherMap)) {
    preparedRoutes.push(...prepareDynamicRoute(routeData, url, addToRoutes))
  }
  if (addToRoutes) {
    RouterManager.addRoutes(preparedRoutes, router, true)
  }
  return preparedRoutes
}

export function findRouteByPath (path: string): RouteConfig {
  return RouterManager.findByPath(path)
}

export function normalizeUrlPath (url: string): string {
  if (url && url.length > 0) {
    if (url[0] === '/') url = url.slice(1)
    if (url.endsWith('/')) url = url.slice(0, -1)
    const queryPos = url.indexOf('?')
    if (queryPos > 0) url = url.slice(0, queryPos)
  }
  return url
}

export function formatCategoryLink (category: Category, storeCode: string = currentStoreView().storeCode): string {
  storeCode ? storeCode += '/' : storeCode = '';

  if (currentStoreView().appendStoreCode === false) {
    storeCode = ''
  }

  if (category) {
    return config.seo.useUrlDispatcher ? ('/' + storeCode + category.url_path) : ('/' + storeCode + 'c/' + category.slug)
  }
  return '/' + storeCode;
}

export function formatProductLink (
  product: {
    parentSku?: string,
    sku: string,
    url_path?: string,
    type_id: string,
    slug: string,
    options?: [],
    configurable_children?: []
  },
  storeCode
): string | LocalizedRoute {
  if (config.seo.useUrlDispatcher && product.url_path) {
    let routeData: LocalizedRoute;
    if ((product.options && product.options.length > 0) || (product.configurable_children && product.configurable_children.length > 0)) {
      routeData = {
        path: product.url_path,
        params: { childSku: product.sku }
      }
    } else {
      routeData = { path: product.url_path }
    }
    return localizedDispatcherRoute(routeData, storeCode)
  } else {
    const routeData: LocalizedRoute = {
      name: product.type_id + '-product',
      params: {
        parentSku: product.parentSku ? product.parentSku : product.sku,
        slug: product.slug,
        childSku: product.sku
      }
    }
    return localizedRoute(routeData, storeCode)
  }
}
