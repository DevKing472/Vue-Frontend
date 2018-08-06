// 3rd party dependecies
import SearchQuery from 'core/store/lib/search/searchQuery'

// Core dependecies
import i18n from 'core/lib/i18n'
import EventBus from 'core/plugins/event-bus'

// Core mixins
import Composite from 'core/mixins/composite'

export default {
  name: 'PageNotFound',
  mixins: [Composite],
  asyncData ({ store, route }) { // this is for SSR purposes to prefetch data
    return new Promise((resolve, reject) => {
      console.log('Entering asyncData for PageNotFound ' + new Date())
      let ourBestsellersQuery = new SearchQuery()
      ourBestsellersQuery = ourBestsellersQuery.applyFilter({key: 'visibility', value: {'in': [2, 3, 4]}})

      store.dispatch('category/list', {}).then((categories) => {
        store.dispatch('product/listByQuery', {
          searchQuery: ourBestsellersQuery,
          size: 8,
          sort: 'created_at:desc'
        }).then(function (res) {
          if (res) {
            store.state.homepage.bestsellers = res.items
            EventBus.$emitFilter('pagenotfound-after-load', { store: store, route: route }).then((results) => {
              return resolve()
            }).catch((err) => {
              console.error(err)
              return resolve()
            })
          }
        })
      })
    })
  },
  metaInfo () {
    return {
      title: this.$route.meta.title || i18n.t('404 Page Not Found'),
      meta: this.$route.meta.description ? [{ vmid: 'description', description: this.$route.meta.description }] : []
    }
  }
}
