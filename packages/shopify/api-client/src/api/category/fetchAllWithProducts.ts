import { _shopifyClient } from '../../index';
import { Category } from '../../types';

/**
 * Fetches all collections on the shop, including products.
 *
 * @example
 * _shopifyClient.collection.fetchAllWithProducts().then((collections) => {
 *   // Do something with the collections
 * });
 *
 * @return {Promise|Category[]} A promise resolving with an array of `Category`s with products.
 */
async function fetchAllWithProducts(): Promise<Category[]> {
  return await _shopifyClient.collection.fetchAllWithProducts();
}

export default fetchAllWithProducts;
