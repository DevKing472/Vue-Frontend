/* istanbul ignore file */

import {
  Context,
  CustomQuery,
  useCartFactory,
  UseCartFactoryParams
} from '@vue-storefront/core';
import { Cart, CartItem, Coupon, Product } from '../types';

// @todo: implement cart

const params: UseCartFactoryParams<Cart, CartItem, Product, Coupon> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  load: async (context: Context) => {
    console.log('Mocked: loadCart');
    return {};
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addItem: async (context: Context, { currentCart, product, quantity }, customQuery?: CustomQuery) => {
    console.log('Mocked: addToCart');
    return {};
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeItem: async (context: Context, { currentCart, product }, customQuery?: CustomQuery) => {
    console.log('Mocked: removeFromCart');
    return {};
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateItemQty: async (context: Context, { currentCart, product, quantity }, customQuery?: CustomQuery) => {
    console.log('Mocked: updateQuantity');
    return {};
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clear: async (context: Context, { currentCart }) => {
    console.log('Mocked: clearCart');
    return {};
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  applyCoupon: async (context: Context, { currentCart, couponCode }, customQuery?: CustomQuery) => {
    console.log('Mocked: applyCoupon');
    return {updatedCart: {}, updatedCoupon: {}};
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeCoupon: async (context: Context, { currentCart, coupon }, customQuery?: CustomQuery) => {
    console.log('Mocked: removeCoupon');
    return {updatedCart: {}};
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isOnCart: (context: Context, { currentCart, product }) => {
    console.log('Mocked: isOnCart');
    return false;
  }
};

export default useCartFactory<Cart, CartItem, Product, Coupon>(params);
