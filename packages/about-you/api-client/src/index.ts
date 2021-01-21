import { apiClientFactory } from '@vue-storefront/core';
import { SetupConfig } from './types/setup';
import { BapiClient } from '@aboutyou/backbone';

let apiClient: BapiClient | null = null;

const { setup, update, getSettings } = apiClientFactory<any, any>({
  defaultSettings: {},
  onSetup: (setupConfig: SetupConfig) => {
    // todo: add possibility to override
    apiClient = new BapiClient({
      host: setupConfig.api.host,
      auth: {
        username: setupConfig.api.auth.username,
        password: setupConfig.api.auth.password
      },
      shopId: setupConfig.api.shopId
    });
  }
});

export const getCart: typeof BapiClient.prototype.basket.get = (id, ...args) => apiClient.basket.get(id || getSettings().cartToken, ...args);
export const addItemToCart: typeof BapiClient.prototype.basket.addItem = (id, ...args) => apiClient.basket.addItem(id || getSettings().cartToken, ...args);
export const deleteItemFromCart: typeof BapiClient.prototype.basket.deleteItem = (id, ...args) => apiClient.basket.deleteItem(id || getSettings().cartToken, ...args);
export const updateItemInCart: typeof BapiClient.prototype.basket.updateItem = (id, ...args) => apiClient.basket.updateItem(id || getSettings().cartToken, ...args);
export const bulkUpdateItemsInCart: typeof BapiClient.prototype.basket.addOrUpdateItems = (id, ...args) => apiClient.basket.addOrUpdateItems(id || getSettings().cartToken, ...args);
export const getCategoryById: typeof BapiClient.prototype.categories.getById = (...args) => apiClient.categories.getById(...args);
export const getCategoriesByIds: typeof BapiClient.prototype.categories.getByIds = (...args) => apiClient.categories.getByIds(...args);
export const getCategoryByPath: typeof BapiClient.prototype.categories.getByPath = (...args) => apiClient.categories.getByPath(...args);
export const getCategoryRoots: typeof BapiClient.prototype.categories.getRoots = (...args) => apiClient.categories.getRoots(...args);
export const getFilters: typeof BapiClient.prototype.filters.get = (...args) => apiClient.filters.get(...args);
export const getFiltersValues: typeof BapiClient.prototype.filters.getValues = (...args) => apiClient.filters.getValues(...args);
export const getProductById: typeof BapiClient.prototype.products.getById = (...args) => apiClient.products.getById(...args);
export const getProductsByIds: typeof BapiClient.prototype.products.getByIds = (...args) => apiClient.products.getByIds(...args);
export const getProductsByQuery: typeof BapiClient.prototype.products.query = (...args) => apiClient.products.query(...args);
export const getSearchSuggestions: typeof BapiClient.prototype.search.suggestions = (...args) => apiClient.search.suggestions(...args);
export const getSearchMappings: typeof BapiClient.prototype.search.mappings = (...args) => apiClient.search.mappings(...args);
export const getVariantsByIds: typeof BapiClient.prototype.variants.getByIds = (...args) => apiClient.variants.getByIds(...args);
export const getWishlist: typeof BapiClient.prototype.wishlist.get = (id, ...args) => apiClient.wishlist.get(id || getSettings().wishlistToken, ...args);
export const addItemToWishlist: typeof BapiClient.prototype.wishlist.addItem = (id, ...args) => apiClient.wishlist.addItem(id || getSettings().wishlistToken, ...args);
export const deleteItemFromWishlist: typeof BapiClient.prototype.wishlist.deleteItem = (id, ...args) => apiClient.wishlist.deleteItem(id || getSettings().wishlistToken, ...args);

export {
  getSettings,
  setup,
  update
};

