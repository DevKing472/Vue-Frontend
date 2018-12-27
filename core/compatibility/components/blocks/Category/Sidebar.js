import { buildFilterProductsQuery } from '@vue-storefront/store/helpers'
import { mapGetters } from 'vuex'

export default {
  name: 'CategorySidebar',
  props: {
    filters: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters('category', ['getCurrentCategory', 'getActiveCategoryFilters', 'getCurrentCategoryProductQuery']),
    category () {
      return this.getCurrentCategory
    },
    activeFilters () {
      return this.getActiveCategoryFilters
    }
  },
  methods: {
    sortById (filters) {
      return [...filters].sort((a, b) => { return a.id - b.id })
    },
    resetAllFilters () {
      this.$bus.$emit('filter-reset')
      this.$store.dispatch('category/resetFilters')
      this.$store.dispatch('category/searchProductQuery', buildFilterProductsQuery(this.category, this.activeFilters))
      this.$store.dispatch('category/products', this.getCurrentCategoryProductQuery)
    }
  }
}
