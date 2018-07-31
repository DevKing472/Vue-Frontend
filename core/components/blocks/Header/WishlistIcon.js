import { openWishlist, closeWishlist, isWishlistOpen } from 'core/api/wishlist'

export default {
  name: 'WishlistIcon',
  mixins: [ openWishlist, closeWishlist, isWishlistOpen ],
  props: {
    product: {
      type: Object,
      required: false,
      default: () => { }
    }
  },
  methods: {
    toggleWishlistPanel () {
      return this.isWishlistOpen ? this.closeWishlist() : this.openWishlist()
    }
  }
}
