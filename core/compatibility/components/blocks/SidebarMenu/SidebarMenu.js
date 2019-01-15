import { mapState, mapGetters } from 'vuex'
import onEscapePress from '@vue-storefront/core/mixins/onEscapePress'
import { CompareButton } from '@vue-storefront/core/modules/compare/components/CompareButton.ts'

// depreciated as theme-specific
export default {
  name: 'SidebarMenu',
  mixins: [onEscapePress, CompareButton],
  computed: {
    ...mapGetters('category', ['getCategories']),
    categories () {
      return this.getCategories.filter((op) => {
        return op.level === (this.$store.state.config.entities.category.categoriesDynamicPrefetchLevel ? this.$store.state.config.entities.category.categoriesDynamicPrefetchLevel : 2) // display only the root level (level =1 => Default Category), categoriesDynamicPrefetchLevel = 2 by default
      })
    },
    ...mapState({
      isOpen: state => state.ui.sidebar
    }),
    compareIsActive () {
      // Computed property renamed to 'isEmpty'
      return !this.isEmpty
    }
  },
  created () {
  },
  methods: {
    onEscapePress () {
      this.closeMenu()
    },
    closeMenu () {
      this.$store.commit('ui/setSidebar', false)
      this.$store.commit('ui/setMicrocart', false)
    }
  }
}
