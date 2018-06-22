import config from 'config'
export default {
  name: 'SortBy',
  data () {
    return {
      sortby: '',
      direction: 'asc'
    }
  },
  methods: {
    changeOrder () {
      this.$bus.$emit('list-change-sort', { attribute: this.sortby, direction: this.direction })
    },
    changeDirection () {
      this.direction = this.direction === 'asc' ? this.direction = 'desc' : this.direction = 'asc'
      this.$bus.$emit('list-change-sort', { attribute: this.sortby, direction: this.direction })
    }
  },
  computed: {
    sortByAttribute () {
      return config.products.sortByAttributes
    }
  }
}
