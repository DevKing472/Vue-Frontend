/* istanbul ignore file */

import useCategory from './useCategory';
import useProduct from './useProduct';
import useCart from './useCart';
import useCheckout from './useCheckout';
import useUser from './useUser';
import useUserOrders from './useUserOrders';
import { useReview } from './useReview';
import useFacet from './useFacet';
import useUserShipping from './useUserShipping';
import useUserBilling from './useUserBilling';
import useWishlist from './useWishlist';
import { track } from '@vue-storefront/core';

track('VSFCommercetools');

const extensions = [
  {
    extendApi: {
      testFunction2: async (context) => {
        console.log('test function2 called', context);
        return { test: 2 };
      }
    }
  }
];

export {
  extensions,
  useCategory,
  useProduct,
  useCart,
  useCheckout,
  useUser,
  useUserOrders,
  useUserBilling,
  useWishlist,
  useUserShipping,
  useReview,
  useFacet
};

export * from './getters';
