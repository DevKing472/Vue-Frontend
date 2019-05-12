import * as localForage from 'localforage'
import store from '@vue-storefront/core/store'

import UniversalStorage from '@vue-storefront/core/store/lib/storage'
import { Logger } from '@vue-storefront/core/lib/logger'
import { ConfigManager } from '@vue-storefront/core/lib/config-manager'

export const CancelOrders = {
  methods: {
    cancelOrders () {
      const ordersCollection = new UniversalStorage(localForage.createInstance({
        name: 'shop',
        storeName: 'orders',
        driver: localForage[ConfigManager.getConfig().localForage.defaultDrivers['orders']]
      }))

      ordersCollection.iterate((order, id, iterationNumber) => {
        if (!order.transmited) {
          ordersCollection.removeItem(id)
        }
      }).catch(err => {
        Logger.error(err, 'offline-order')()
        Logger.log('Not transmitted orders have been deleted', 'offline-order')()
      })
    }
  }
}
