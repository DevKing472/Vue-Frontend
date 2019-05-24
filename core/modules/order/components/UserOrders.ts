import { mapGetters } from 'vuex';

/**
 * Component responsible for displaying user orders. Requires User module.
 */
export const UserOrders = {
  name: 'UserOrders',
  computed: {
    ordersHistory () {
      return this.ordersHistoryItems()
    },
    isHistoryEmpty () {
      return this.ordersHistoryItems().length < 1
    }
  },
  methods: {
    ...mapGetters('user', ['ordersHistoryItems']),
    remakeOrder (products) {
      products.forEach(item => {
        this.$store.dispatch('product/single', { options: { sku: item.sku }, setCurrentProduct: false, selectDefaultVariant: false }).then((product) => {
          product.qty = item.qty_ordered
          this.$store.dispatch('cart/addItem', { productToAdd: product }).then(() => { })
        })
      })
    },
    skipGrouped (items) {
      return items.filter((item) => {
        return !item.parent_item_id
      })
    }
  }
}
