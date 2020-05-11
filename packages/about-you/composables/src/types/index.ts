import { BapiCategory } from '@aboutyou/backbone/types/BapiCategory';
import { BapiProduct } from '@aboutyou/backbone/types/BapiProduct';
import { UseCategory } from '@vue-storefront/core';
import { UseProduct } from '@vue-storefront/core';
import { ComputedProperty } from '@vue-storefront/core';

// @todo: replace with real BapiUser type when AYC publishes that part of api
type BapiUser = {
  firstName?: string;
  lastName?: string;
}

type BapiUserAddress = {
}

// @todo: replace with real BapiCart types when AYC publishes that part of api
type BapiCart = {

}

type BapiCartItem = {

}

type BapiCoupon = {

}

// @todo: replace with real BapiOrder type when AYC publishes that part of api
type BapiOrder = {

}

type BapiLineItem = {

}

type BapiOrderSearchParams = {

}

type BapiShippingMethod = {

}

type BapiWishlistProduct = {

}

type BapiWishlist = {

}

interface UseWishlist
<
  WISHLIST,
  PRODUCT,
  WISHLIST_ITEM,
> {
  wishlist: ComputedProperty<WISHLIST>;
  addToWishlist: (product: PRODUCT, quantity: number) => Promise<void>;
  removeFromWishlist: (product: WISHLIST_ITEM) => Promise<void>;
  clearWishlist: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
  loading: ComputedProperty<boolean>;
}
export interface UseCompare<PRODUCT> {
  compare: ComputedProperty<PRODUCT[]>;
  addToCompare: (product: PRODUCT) => Promise<void>;
  removeFromCompare: (product: PRODUCT) => Promise<void>;
  clearCompare: () => Promise<void>;
  loading: ComputedProperty<boolean>;
}

export {
  BapiCart,
  BapiCartItem,
  BapiCategory,
  BapiCoupon,
  BapiOrder,
  BapiLineItem,
  BapiOrderSearchParams,
  BapiProduct,
  BapiShippingMethod,
  BapiUser,
  BapiUserAddress,
  BapiWishlist,
  BapiWishlistProduct,
  UseCategory,
  UseProduct,
  UseWishlist
};
