import Vue from 'vue'
import i18n from '@vue-storefront/i18n'
import isNaN from 'lodash-es/isNaN'
import isUndefined from 'lodash-es/isUndefined'
import toString from 'lodash-es/toString'
import fetch from 'isomorphic-fetch'
import * as localForage from 'localforage'
import rootStore from '@vue-storefront/store'
import { adjustMultistoreApiUrl, currentStoreView } from '@vue-storefront/core/lib/multistore'
import Task from '@vue-storefront/core/lib/sync/types/Task'
import { Logger } from '@vue-storefront/core/lib/logger'
import { TaskQueue } from '@vue-storefront/core/lib/sync'
import * as entities from '@vue-storefront/store/lib/entities'
import UniversalStorage from '@vue-storefront/store/lib/storage'

const AUTO_REFRESH_MAX_ATTEMPTS = 20

export function _prepareTask (task) {
  const taskId = entities.uniqueEntityId(task) // timestamp as a order id is not the best we can do but it's enough
  task.task_id = taskId.toString()
  task.transmited = false
  task.created_at = new Date()
  task.updated_at = new Date()
  return task
}

function _sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

function _internalExecute (resolve, reject, task: Task, currentToken, currentCartId) {

  if (currentToken !== null && rootStore.state.userTokenInvalidateLock > 0) { // invalidate lock set
    Logger.log('Waiting for rootStore.state.userTokenInvalidateLock to release for '+ task.url, 'sync')()
    _sleep(1000).then(() => {
      Logger.log('Another try for rootStore.state.userTokenInvalidateLock for ' + task.url, 'sync')()
      _internalExecute(resolve, reject, task, currentToken, currentCartId)
    })
    return // return but not resolve
  } else if (rootStore.state.userTokenInvalidateLock < 0) {
    Logger.error('Aborting the network task' + task.url + rootStore.state.userTokenInvalidateLock, 'sync')()
    resolve({ code: 401, message: i18n.t('Error refreshing user token. User is not authorized to access the resource') })()
    return
  } else {
    if (rootStore.state.userTokenInvalidated) {
      Logger.log('Using new user token' + rootStore.state.userTokenInvalidated, 'sync')()
      currentToken = rootStore.state.userTokenInvalidated
    }
  }
  let url = task.url.replace('{{token}}', (currentToken == null) ? '' : currentToken).replace('{{cartId}}', (currentCartId == null) ? '' : currentCartId)
  if (rootStore.state.config.storeViews.multistore) {
    url = adjustMultistoreApiUrl(url)
  }
  let silentMode = false
  Logger.info('Executing sync task ' + url, 'sync', task)()
  return fetch(url, task.payload).then((response) => {
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return response.json()
    } else {
      const msg = i18n.t('Error with response - bad content-type!')
      Logger.error(msg.toString(), 'sync')()
      reject(msg)
    }
  }).then((jsonResponse) => {
    if (jsonResponse) {
      if (parseInt(jsonResponse.code) !== 200) {
        let resultString = jsonResponse.result ? toString(jsonResponse.result) : null
        if (resultString && (resultString.indexOf(i18n.t('not authorized')) >= 0 || resultString.indexOf('not authorized')) >= 0 && currentToken !== null) { // the token is no longer valid, try to invalidate it
          Logger.error('Invalid token - need to be revalidated' + currentToken + task.url + rootStore.state.userTokenInvalidateLock, 'sync')()
          if (isNaN(rootStore.state.userTokenInvalidateAttemptsCount) || isUndefined(rootStore.state.userTokenInvalidateAttemptsCount)) rootStore.state.userTokenInvalidateAttemptsCount = 0
          if (isNaN(rootStore.state.userTokenInvalidateLock) || isUndefined(rootStore.state.userTokenInvalidateLock)) rootStore.state.userTokenInvalidateLock = 0

          silentMode = true
          if (rootStore.state.config.users.autoRefreshTokens) {
            if (!rootStore.state.userTokenInvalidateLock) {
              rootStore.state.userTokenInvalidateLock++
              if (rootStore.state.userTokenInvalidateAttemptsCount >= AUTO_REFRESH_MAX_ATTEMPTS) {
                Logger.error('Internal Application error while refreshing the tokens. Please clear the storage and refresh page.', 'sync')()
                rootStore.state.userTokenInvalidateLock = -1
                rootStore.dispatch('user/logout', { silent: true })
                TaskQueue.clearNotTransmited()
                Vue.prototype.$bus.$emit('modal-show', 'modal-signup')
                rootStore.dispatch('notification/spawnNotification', {
                  type: 'error',
                  message: i18n.t('Internal Application error while refreshing the tokens. Please clear the storage and refresh page.'),
                  action1: { label: i18n.t('OK') }
                })
                rootStore.state.userTokenInvalidateAttemptsCount = 0
              } else {
                Logger.info('Invalidation process in progress (autoRefreshTokens is set to true)' + rootStore.state.userTokenInvalidateAttemptsCount + rootStore.state.userTokenInvalidateLock, 'sync')()
                rootStore.state.userTokenInvalidateAttemptsCount++
                rootStore.dispatch('user/refresh').then((resp) => {
                  if (resp.code === 200) {
                    rootStore.state.userTokenInvalidateLock = 0
                    rootStore.state.userTokenInvalidated = resp.result
                    Logger.info('User token refreshed successfully' + resp.result, 'sync')()
                  } else {
                    rootStore.state.userTokenInvalidateLock = -1
                    rootStore.dispatch('user/logout', { silent: true })
                    Vue.prototype.$bus.$emit('modal-show', 'modal-signup')
                    TaskQueue.clearNotTransmited()
                    Logger.error('Error refreshing user token' + resp.result, 'sync')()
                  }
                }).catch((excp) => {
                  rootStore.state.userTokenInvalidateLock = -1
                  rootStore.dispatch('user/logout', { silent: true })
                  Vue.prototype.$bus.$emit('modal-show', 'modal-signup')
                  TaskQueue.clearNotTransmited()
                  Logger.error('Error refreshing user token' + excp, 'sync')()
                })
              }
            }
            if (rootStore.state.userTokenInvalidateAttemptsCount <= AUTO_REFRESH_MAX_ATTEMPTS) _internalExecute(resolve, reject, task, currentToken, currentCartId) // retry
          } else {
            Logger.info('Invalidation process is disabled (autoRefreshTokens is set to false)', 'sync')()
            rootStore.dispatch('user/logout', { silent: true })
            Vue.prototype.$bus.$emit('modal-show', 'modal-signup')
          }
        }
        if (!task.silent && (jsonResponse.result && jsonResponse.result.code !== 'ENOTFOUND' && !silentMode)) {
          rootStore.dispatch('notification/spawnNotification', {
            type: 'error',
            message: i18n.t(jsonResponse.result),
            action1: { label: i18n.t('OK') }
          })
        }
      }
      Logger.debug('Response for: ' + task.task_id + ' = ' + JSON.stringify(jsonResponse.result), 'sync')()
      task.transmited = true
      task.transmited_at = new Date()
      task.result = jsonResponse.result
      task.resultCode = jsonResponse.code
      task.code = jsonResponse.code // backward compatibility to fetch()
      task.acknowledged = false

      if (task.callback_event) {
        if (task.callback_event.startsWith('store:')) {
          rootStore.dispatch(task.callback_event.split(':')[1], task)
        } else {
          Vue.prototype.$bus.$emit(task.callback_event, task)
        }
      }
      if (!rootStore.state.userTokenInvalidateLock) { // in case we're revalidaing the token - user must wait for it
        resolve(task)
      }
    } else {
      const msg = i18n.t('Unhandled error, wrong response format!')
      Logger.error(msg.toString(), 'sync')()
      reject(msg)
    }
  }).catch((err) => {
    Logger.error(err, 'sync')()
    reject(err)
  })
}

export function execute (task: Task, currentToken = null, currentCartId = null): Promise<Task> {
  const taskId = task.task_id

  return new Promise((resolve, reject) => {
    _internalExecute(resolve, reject, task, currentToken, currentCartId)
  })
}

export function initializeSyncTaskStorage () {
  const storeView = currentStoreView()
  const dbNamePrefix = storeView.storeCode ? storeView.storeCode + '-' : ''

  Vue.prototype.$db.syncTaskCollection = new UniversalStorage(localForage.createInstance({
    name: dbNamePrefix + 'shop',
    storeName: 'syncTasks',
    driver: localForage[rootStore.state.config.localForage.defaultDrivers['syncTasks']]
  }))
}
