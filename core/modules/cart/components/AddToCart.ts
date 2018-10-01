import Product from '@vue-storefront/store/types/product/Product'

export default {
  name: 'AddToCart-cart',
  props: {
    product: {
      required: true,
      type: Object
    }
  },
  methods: {
    addToCart (product: Product) {
      this.$store.dispatch('cart/addItem', { productToAdd: product })
    }
  }
}
