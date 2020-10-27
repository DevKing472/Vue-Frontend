import { UseWishlist, CustomQuery } from '../types';
import { Ref, computed } from '@vue/composition-api';
import { sharedRef, Logger } from '../utils';

export type UseWishlistFactoryParams<WISHLIST, WISHLIST_ITEM, PRODUCT> = {
  loadWishlist: (customQuery?: CustomQuery) => Promise<WISHLIST>;
  addToWishlist: (params: {
    currentWishlist: WISHLIST;
    product: PRODUCT;
  }, customQuery?: CustomQuery) => Promise<WISHLIST>;
  removeFromWishlist: (params: {
    currentWishlist: WISHLIST;
    product: WISHLIST_ITEM;
  }, customQuery?: CustomQuery) => Promise<WISHLIST>;
  clearWishlist: (params: { currentWishlist: WISHLIST }) => Promise<WISHLIST>;
  isOnWishlist: (params: { currentWishlist: WISHLIST; product: PRODUCT }) => boolean;
};

interface UseWishlistFactory<WISHLIST, WISHLIST_ITEM, PRODUCT> {
  useWishlist: () => UseWishlist<WISHLIST, WISHLIST_ITEM, PRODUCT>;
  setWishlist: (wishlist: WISHLIST) => void;
}

export const useWishlistFactory = <WISHLIST, WISHLIST_ITEM, PRODUCT>(
  factoryParams: UseWishlistFactoryParams<WISHLIST, WISHLIST_ITEM, PRODUCT>
): UseWishlistFactory<WISHLIST, WISHLIST_ITEM, PRODUCT> => {
  const setWishlist = (newWishlist: WISHLIST) => {
    sharedRef('useWishlist-wishlist').value = newWishlist;
    Logger.debug('useWishlistFactory.setWishlist', newWishlist);
  };

  const useWishlist = (): UseWishlist<WISHLIST, WISHLIST_ITEM, PRODUCT> => {
    const loading: Ref<boolean> = sharedRef<boolean>(false, 'useWishlist-loading');
    const wishlist: Ref<WISHLIST> = sharedRef(null, 'useWishlist-wishlist');

    const addToWishlist = async (product: PRODUCT, customQuery?: CustomQuery) => {
      Logger.debug('useWishlist.addToWishlist', product);

      loading.value = true;
      const updatedWishlist = await factoryParams.addToWishlist(
        {
          currentWishlist: wishlist.value,
          product
        },
        customQuery
      );
      wishlist.value = updatedWishlist;
      loading.value = false;
    };

    const removeFromWishlist = async (product: WISHLIST_ITEM, customQuery?: CustomQuery) => {
      Logger.debug('useWishlist.removeFromWishlist', product);

      loading.value = true;
      const updatedWishlist = await factoryParams.removeFromWishlist(
        {
          currentWishlist: wishlist.value,
          product
        },
        customQuery
      );
      wishlist.value = updatedWishlist;
      loading.value = false;
    };

    const loadWishlist = async (customQuery?: CustomQuery) => {
      Logger.debug('useWishlist.loadWishlist');

      if (wishlist.value) return;

      loading.value = true;
      wishlist.value = await factoryParams.loadWishlist(customQuery);
      loading.value = false;
    };

    const clearWishlist = async () => {
      Logger.debug('useWishlist.clearWishlist');

      loading.value = true;
      const updatedWishlist = await factoryParams.clearWishlist({
        currentWishlist: wishlist.value
      });
      wishlist.value = updatedWishlist;
      loading.value = false;
    };

    const isOnWishlist = (product: PRODUCT) => {
      Logger.debug('useWishlist.isOnWishlist', product);

      return factoryParams.isOnWishlist({
        currentWishlist: wishlist.value,
        product
      });
    };

    return {
      wishlist: computed(() => wishlist.value),
      isOnWishlist,
      addToWishlist,
      loadWishlist,
      removeFromWishlist,
      clearWishlist,
      loading: computed(() => loading.value)
    };
  };

  return { useWishlist, setWishlist };
};

