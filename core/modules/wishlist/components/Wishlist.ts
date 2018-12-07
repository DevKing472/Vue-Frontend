import { Wishlist as WishlistModule } from '../'

export const Wishlist = {
  name: 'Wishlist',
  created () {
    WishlistModule.register()
    this.$store.dispatch('wishlist/load')
  },
  computed: {
    isWishlistOpen () {
      return this.$store.state.ui.wishlist
    },
    productsInWishlist () {
      return this.$store.state.wishlist.items
    }
  },
  methods: {
    closeWishlist () {
      this.$store.dispatch('ui/toggleWishlist')
    }
  }
}
