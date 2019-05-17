import { productThumbnailPath } from '@vue-storefront/core/helpers'
import config from 'config'

export const MicrocartProduct = {
  name: 'MicrocartProduct',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  computed: {
    thumbnail () {
      const thumbnail = productThumbnailPath(this.product)
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        return this.getThumbnail(thumbnail, config.products.gallery.width, config.products.gallery.height) // for offline support we do need to have ProductTile version
      } else return this.getThumbnail(thumbnail, config.cart.thumbnail.width, config.cart.thumbnail.height)
    }
  },
  methods: {
    removeFromCart () {
      this.$store.dispatch('cart/removeItem', { product: this.product })
    },
    updateQuantity (quantity) {
      this.$store.dispatch('cart/updateQuantity', { product: this.product, qty: quantity })
    }
  }
}
