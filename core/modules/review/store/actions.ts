import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'
import { ActionTree } from 'vuex'
import { quickSearchByQuery } from '@vue-storefront/core/lib/search'
import SearchQuery from '@vue-storefront/core/lib/search/searchQuery'
import { adjustMultistoreApiUrl } from '@vue-storefront/core/lib/multistore'
import RootState from '@vue-storefront/core/types/RootState'
import ReviewState from '../types/ReviewState'
import * as types from './mutation-types'
import i18n from '@vue-storefront/i18n'
import rootStore from '@vue-storefront/core/store'
import Review from '@vue-storefront/core/modules/review/types/Review'
import { ReviewRequest } from '@vue-storefront/core/modules/review/types/ReviewRequest'
import { Logger } from '@vue-storefront/core/lib/logger'
import config from 'config'
import { processURLAddress } from '@vue-storefront/core/helpers'

const actions: ActionTree<ReviewState, RootState> = {
  /**
   * Retrieve reviews
   *
   * @param context
   * @param {any} query
   * @param {any} start
   * @param {any} size
   * @param {any} entityType
   * @param {any} sort
   * @param {any} excludeFields
   * @param {any} includeFields
   * @returns {Promise<T> & Promise<any>}
   */
  list (context, {productId, approved = true, start = 0, size = 50, entityType = 'review', sort = '', excludeFields = null, includeFields = null}) {
    let query = new SearchQuery()

    if (productId) {
      query = query.applyFilter({key: 'product_id', value: {'eq': productId}})
    }

    if (approved) {
      query = query.applyFilter({key: 'review_status', value: {'eq': 1}})
    }

    quickSearchByQuery({ query, start, size, entityType, sort, excludeFields, includeFields }).then((resp) => {
      context.commit(types.REVIEW_UPD_REVIEWS, resp)
    }).catch(err => {
      Logger.error(err, 'review')()
    })
  },

  /**
   * Add new review
   *
   * @param context
   * @param {Review} reviewData
   * @returns {Promise<void>}
   */
  async add (context, reviewData: Review) {
    const review: ReviewRequest = {review: reviewData}

    EventBus.$emit('notification-progress-start', i18n.t('Adding a review ...'))

    let url = config.reviews.create_endpoint

    if (config.storeViews.multistore) {
      url = adjustMultistoreApiUrl(url)
    }

    try {
      await fetch(processURLAddress(url), {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(review)
      })
      EventBus.$emit('notification-progress-stop')
      rootStore.dispatch('notification/spawnNotification', {
        type: 'success',
        message: i18n.t('You submitted your review for moderation.'),
        action1: { label: i18n.t('OK') }
      })
      EventBus.$emit('clear-add-review-form')
    } catch (e) {
      EventBus.$emit('notification-progress-stop')
      rootStore.dispatch('notification/spawnNotification', {
        type: 'error',
        message: i18n.t('Something went wrong. Try again in a few seconds.'),
        action1: { label: i18n.t('OK') }
      })
    };
  }
}

export default actions
