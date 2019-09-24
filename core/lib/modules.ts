import { VSFRouter } from '@vue-storefront/core/types/VSFRouter';
import { Store } from 'vuex'

export interface StorefrontModule { (
  app: any,
  store: Store<any>,
  router: VSFRouter,
  moduleConfig: any,
  appConfig: any): void
}

let refs: any = {}
let registeredModules: any = []

function injectReferences (app: any, store: Store<any>, router: VSFRouter, config: any): void {
  refs.app = app
  refs.store = store
  refs.router = router
  refs.config = config
}

function registerModule (module: StorefrontModule, config?: any) {
  if (!registeredModules.includes(module)) {
    module(refs.app, refs.store, refs.router, config, refs.config)
    registeredModules.push(module)
  }
}

function isModuleRegistered (name: string): boolean {
  return registeredModules.some(m => m.name === name)
}

export { refs, injectReferences, registerModule, isModuleRegistered }
