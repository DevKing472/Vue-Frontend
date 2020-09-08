/* istanbul ignore file */
import { useCart, setCart } from './composables/useCart';
import { useWishlist, setWishlist } from './composables/useWishlist';
import useCategory from './composables/useCategory';
import useCheckout from './composables/useCheckout';
import useProduct from './composables/useProduct';
import useSearch from './composables/useSearch';
import { useUser, setUser } from './composables/useUser';
import useUserOrders from './composables/useUserOrders';
import {
  cartGetters,
  userGetters,
  categoryGetters,
  productGetters,
  checkoutGetters,
  orderGetters,
  wishlistGetters
} from './composables/getters/';

export {
  cartGetters,
  categoryGetters,
  checkoutGetters,
  productGetters,
  orderGetters,
  wishlistGetters,
  useCart,
  useCategory,
  useCheckout,
  useProduct,
  useSearch,
  useUser,
  useUserOrders,
  useWishlist,
  setCart,
  setWishlist,
  setUser,
  userGetters
};

