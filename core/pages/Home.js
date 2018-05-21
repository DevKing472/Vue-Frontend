// 3rd party dependecies
import { mapGetters } from 'vuex'

// Core dependecies
import EventBus from 'core/plugins/event-bus'
import i18n from 'core/lib/i18n'

// Core mixins
import Composite from 'core/mixins/composite'

export default {
  name: 'Home',
  mixins: [Composite],
  computed: {
    ...mapGetters({
      rootCategories: 'category/list'
    })
  },
  asyncData ({ store, route }) { // this is for SSR purposes to prefetch data
    return new Promise((resolve, reject) => {
      console.log('Entering asyncData for Home root ' + new Date())
      EventBus.$emitFilter('home-after-load', { store: store, route: route }).then((results) => {
        return resolve()
      }).catch((err) => {
        console.error(err)
        return resolve()
      })
    })
  },
  beforeMount () {
    this.$store.dispatch('category/reset')
  },
  metaInfo () {
    return {
      title: this.$route.meta.title || i18n.t('Home Page'),
      meta: this.$route.meta.description ? [{ vmid: 'description', description: this.$route.meta.description }] : []
    }
  }
}
