import { ProductsSearchParams } from '../types';
import { ProductVariant } from './../types/GraphQL';
import { enhanceProduct, mapPaginationParams } from './../helpers/internals';
import { useProductFactory, ProductsSearchResult, UseProduct, Context } from '@vue-storefront/core';

const productsSearch = async (context: Context, { searchParams, customQuery }): Promise<ProductsSearchResult<ProductVariant>> => {
  const apiSearchParams = {
    ...searchParams,
    ...mapPaginationParams(searchParams)
  };

  const productResponse = await context.$ct.api.getProduct(apiSearchParams, customQuery);
  const enhancedProductResponse = enhanceProduct(productResponse);
  const products = (enhancedProductResponse.data as any)._variants;

  return {
    data: products,
    total: productResponse.data.products.total
  };
};

const useProduct: (cacheId: string) => UseProduct<ProductVariant> = useProductFactory<ProductVariant, ProductsSearchParams>({
  productsSearch
});

export default useProduct;
