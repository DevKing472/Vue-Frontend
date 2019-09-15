import { Category } from '../../types/Category';
import Product from 'core/modules/catalog/types/Product';

export default interface CategoryState {
  categoriesMap: { [id: string]: Category },
  filtersMap: { [id: string]: any },
  products: Product[],
  searchProductsStats: any
}
