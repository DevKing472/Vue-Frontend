import { CustomQuery, UseCart, Context, FactoryParams } from '../types';
import { Ref, computed } from '@vue/composition-api';
import { sharedRef, Logger, generateContext } from '../utils';

export interface UseCartFactoryParams<CART, CART_ITEM, PRODUCT, COUPON> extends FactoryParams {
  load: (context: Context, params: { customQuery?: any }) => Promise<CART>;
  addItem: (
    context: Context,
    params: {
      currentCart: CART;
      product: PRODUCT;
      quantity: any;
      customQuery?: CustomQuery;
    }
  ) => Promise<CART>;
  removeItem: (context: Context, params: { currentCart: CART; product: CART_ITEM; customQuery?: CustomQuery }) => Promise<CART>;
  updateItemQty: (
    context: Context,
    params: { currentCart: CART; product: CART_ITEM; quantity: number; customQuery?: CustomQuery }
  ) => Promise<CART>;
  clear: (context: Context, params: { currentCart: CART }) => Promise<CART>;
  applyCoupon: (context: Context, params: { currentCart: CART; couponCode: string; customQuery?: CustomQuery }) => Promise<{ updatedCart: CART }>;
  removeCoupon: (
    context: Context,
    params: { currentCart: CART; coupon: COUPON; customQuery?: CustomQuery }
  ) => Promise<{ updatedCart: CART }>;
  isOnCart: (context: Context, params: { currentCart: CART; product: PRODUCT }) => boolean;
}

export const useCartFactory = <CART, CART_ITEM, PRODUCT, COUPON>(
  factoryParams: UseCartFactoryParams<CART, CART_ITEM, PRODUCT, COUPON>
) => {
  return function useCart (): UseCart<CART, CART_ITEM, PRODUCT, COUPON> {
    const loading: Ref<boolean> = sharedRef(false, 'useCart-loading');
    const cart: Ref<CART> = sharedRef(null, 'useCart-cart');
    const context = generateContext(factoryParams);

    const setCart = (newCart: CART) => {
      cart.value = newCart;
      Logger.debug('useCartFactory.setCart', newCart);
    };

    const addItem = async ({ product, quantity, customQuery }) => {
      Logger.debug('useCart.addItem', { product, quantity });

      loading.value = true;
      const updatedCart = await factoryParams.addItem(
        context,
        {
          currentCart: cart.value,
          product,
          quantity,
          customQuery
        }
      );
      cart.value = updatedCart;
      loading.value = false;
    };

    const removeItem = async ({ product, customQuery }) => {
      Logger.debug('useCart.removeItem', { product });

      loading.value = true;
      const updatedCart = await factoryParams.removeItem(
        context,
        {
          currentCart: cart.value,
          product,
          customQuery
        }
      );
      cart.value = updatedCart;
      loading.value = false;
    };

    const updateItemQty = async ({ product, quantity, customQuery }) => {
      Logger.debug('useCart.updateItemQty', { product, quantity });

      if (quantity && quantity > 0) {
        loading.value = true;
        const updatedCart = await factoryParams.updateItemQty(
          context,
          {
            currentCart: cart.value,
            product,
            quantity,
            customQuery
          }
        );
        cart.value = updatedCart;
        loading.value = false;
      }
    };

    const load = async ({ customQuery } = { customQuery: undefined }) => {
      Logger.debug('useCart.load');

      if (cart.value) {

        /**
          * Triggering change for hydration purpose,
          * temporary issue related with cpapi plugin
          */
        loading.value = false;
        cart.value = { ...cart.value };
        return;
      }
      loading.value = true;
      cart.value = await factoryParams.load(context, { customQuery });
      loading.value = false;
    };

    const clear = async () => {
      Logger.debug('useCart.clear');

      loading.value = true;
      const updatedCart = await factoryParams.clear(context, { currentCart: cart.value });
      cart.value = updatedCart;
      loading.value = false;
    };

    const isOnCart = ({ product }) => {
      return factoryParams.isOnCart(context, {
        currentCart: cart.value,
        product
      });
    };

    const applyCoupon = async ({ couponCode, customQuery }) => {
      Logger.debug('useCart.applyCoupon');

      try {
        loading.value = true;
        const { updatedCart } = await factoryParams.applyCoupon(context, {
          currentCart: cart.value,
          couponCode,
          customQuery
        });
        cart.value = updatedCart;
      } catch (e) {
        Logger.error('useCart.applyCoupon', e);
        throw e;
      } finally {
        loading.value = false;
      }
    };

    const removeCoupon = async ({ coupon, customQuery }) => {
      Logger.debug('useCart.removeCoupon');

      try {
        loading.value = true;
        const { updatedCart } = await factoryParams.removeCoupon(
          context,
          {
            currentCart: cart.value,
            coupon,
            customQuery
          }
        );
        cart.value = updatedCart;
        loading.value = false;
      } catch (e) {
        Logger.error('useCart.applyCoupon', e);
        throw e;
      } finally {
        loading.value = false;
      }
    };

    return {
      setCart,
      cart: computed(() => cart.value),
      isOnCart,
      addItem,
      load,
      removeItem,
      clear,
      updateItemQty,
      applyCoupon,
      removeCoupon,
      loading: computed(() => loading.value)
    };
  };
};
