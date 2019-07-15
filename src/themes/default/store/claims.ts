import { StorageManager } from '@vue-storefront/core/store/lib/storage-manager'
import { Logger } from '@vue-storefront/core/lib/logger'

export const claimsStore = {
  namespaced: true,
  actions: {
    set (context, { claimCode, value, description }) {
      const claimCollection = StorageManager.get('claimCollection')
      claimCollection.setItem(claimCode, {
        code: claimCode,
        created_at: new Date(),
        value: value,
        description: description
      }).catch((reason) => {
        Logger.error(reason) // it doesn't work on SSR
      })
    },

    unset (context, { claimCode }) {
      const claimCollection = StorageManager.get('claimCollection')
      claimCollection.removeItem(claimCode).catch((reason) => {
        Logger.error(reason) // it doesn't work on SSR
      })
    },

    check (context, { claimCode }) {
      const claimCollection = StorageManager.get('claimCollection')
      return claimCollection.getItem(claimCode).catch((reason) => {
        Logger.error(reason) // it doesn't work on SSR
      })
    }
  }
}
