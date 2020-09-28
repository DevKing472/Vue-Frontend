import { UseCategory } from '@vue-storefront/core';
import { getCategory } from '@vue-storefront/commercetools-api';
import { Category } from './../types/GraphQL';
import { useCategoryFactory, UseCategoryFactoryParams, CustomQueryFn } from '@vue-storefront/core';

const params: UseCategoryFactoryParams<Category, any> = {
  categorySearch: async (params, customQuery?: CustomQueryFn) => {
    const categoryResponse = await getCategory(params, customQuery);
    return categoryResponse.data.categories.results;
  }
};

const useCategory: (id: string) => UseCategory<Category> = useCategoryFactory<Category, any>(params);

export default useCategory;
