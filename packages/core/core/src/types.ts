/* istanbul ignore file */

import { Ref } from '@vue/composition-api';

export type ComputedProperty<T> = Readonly<Ref<Readonly<T>>>;

export type CustomQuery<T = any> = (query: any, variables: T) => {
  query?: any;
  variables?: T;
};

export interface SearchParams {
  perPage?: number;
  page?: number;
  sort?: any;
  term?: any;
  filters?: any;
  [x: string]: any;
}

export interface UseProduct<PRODUCT, PRODUCT_FILTERS, SORTING_OPTIONS> {
  products: ComputedProperty<PRODUCT[]>;
  totalProducts: ComputedProperty<number>;
  loading: ComputedProperty<boolean>;
  search(params: SearchParams): Promise<void>;
  search(params: SearchParams, customQuery?: CustomQuery): Promise<void>;
  [x: string]: any;
}

export interface UseUserRegisterParams {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  [x: string]: any;
}

export interface UseUserLoginParams {
  username: string;
  password: string;
  [x: string]: any;
}

export interface UseUser
<
  USER,
  UPDATE_USER_PARAMS
> {
  user: ComputedProperty<USER>;
  updateUser: (params: UPDATE_USER_PARAMS) => Promise<void>;
  register: (user: UseUserRegisterParams) => Promise<void>;
  login: (user: UseUserLoginParams) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  load: () => Promise<void>;
  isAuthenticated: Ref<boolean>;
  loading: ComputedProperty<boolean>;
}

export interface UseUserOrdersSearchParams {
  id?: any;
  page?: number;
  perPage?: number;
  [x: string]: any;
}

export interface UseUserOrders<ORDER> {
  orders: ComputedProperty<ORDER[]>;
  totalOrders: ComputedProperty<number>;
  searchOrders(params: UseUserOrdersSearchParams): Promise<void>;
  searchOrders(params: UseUserOrdersSearchParams, customQuery: CustomQuery): Promise<void>;
  loading: ComputedProperty<boolean>;
}

export interface UseUserAddress<ADDRESS> {
  addresses: ComputedProperty<ADDRESS[]>;
  totalAddresses: ComputedProperty<number>;
  addAddress: (address: ADDRESS) => Promise<void>;
  deleteAddress: (address: ADDRESS) => Promise<void>;
  updateAddress: (address: ADDRESS) => Promise<void>;
  searchAddresses: (params?: { [x: string]: any }) => Promise<void>;
  loading: ComputedProperty<boolean>;
}

export interface UseUserShipping<USER_SHIPPING, USER_SHIPPING_ITEM> {
  shipping: ComputedProperty<USER_SHIPPING>;
  addAddress: (address: USER_SHIPPING_ITEM) => Promise<void>;
  deleteAddress: (address: USER_SHIPPING_ITEM) => Promise<void>;
  updateAddress: (address: USER_SHIPPING_ITEM) => Promise<void>;
  load: () => Promise<void>;
  setDefault: (address: USER_SHIPPING_ITEM) => Promise<void>;
  loading: ComputedProperty<boolean>;
}

export interface UserShippingGetters<USER_SHIPPING, USER_SHIPPING_ITEM> {
  getAddresses: (shipping: USER_SHIPPING, criteria?: Record<string, any>) => USER_SHIPPING_ITEM[];
  getDefault: (shipping: USER_SHIPPING) => USER_SHIPPING_ITEM;
  getTotal: (shipping: USER_SHIPPING) => number;
  getPostCode: (address: USER_SHIPPING_ITEM) => string;
  getStreetName: (address: USER_SHIPPING_ITEM) => string;
  getStreetNumber: (address: USER_SHIPPING_ITEM) => string | number;
  getCity: (address: USER_SHIPPING_ITEM) => string;
  getFirstName: (address: USER_SHIPPING_ITEM) => string;
  getLastName: (address: USER_SHIPPING_ITEM) => string;
  getCountry: (address: USER_SHIPPING_ITEM) => string;
  getPhone: (address: USER_SHIPPING_ITEM) => string;
  getEmail: (address: USER_SHIPPING_ITEM) => string;
  getProvince: (address: USER_SHIPPING_ITEM) => string;
  getCompanyName: (address: USER_SHIPPING_ITEM) => string;
  getTaxNumber: (address: USER_SHIPPING_ITEM) => string;
  getId: (address: USER_SHIPPING_ITEM) => string | number;
  getApartmentNumber: (address: USER_SHIPPING_ITEM) => string | number;
  isDefault: (address: USER_SHIPPING_ITEM) => boolean;
}

export interface UseUserBilling<ADDRESS> {
  addresses: ComputedProperty<ADDRESS[]>;
  totalAddresses: ComputedProperty<number>;
  addAddress: (address: ADDRESS) => Promise<void>;
  deleteAddress: (address: ADDRESS) => Promise<void>;
  updateAddress: (address: ADDRESS) => Promise<void>;
  load: () => Promise<void>;
  defaultAddress: ComputedProperty<ADDRESS>;
  setDefault: (address: ADDRESS) => Promise<void>;
  loading: ComputedProperty<boolean>;
}

export interface UseCategory<CATEGORY> {
  categories: ComputedProperty<CATEGORY[]>;
  search(params: Record<string, any>): Promise<void>;
  search(params: Record<string, any>, customQuery: CustomQuery): Promise<void>;
  loading: ComputedProperty<boolean>;
}

export interface UseCart
<
  CART,
  CART_ITEM,
  PRODUCT,
  COUPON
  > {
  cart: ComputedProperty<CART>;
  addToCart(product: PRODUCT, quantity?: number): Promise<void>;
  addToCart(product: PRODUCT, quantity?: number, customQuery?: CustomQuery): Promise<void>;
  isOnCart: (product: PRODUCT) => boolean;
  removeFromCart(product: CART_ITEM): Promise<void>;
  removeFromCart(product: CART_ITEM, customQuery: CustomQuery): Promise<void>;
  updateQuantity(product: CART_ITEM, quantity?: number): Promise<void>;
  updateQuantity(product: CART_ITEM, quantity?: number, customQuery?: CustomQuery): Promise<void>;
  clearCart(): Promise<void>;
  applyCoupon(coupon: string): Promise<void>;
  applyCoupon(coupon: string, customQuery: CustomQuery): Promise<void>;
  removeCoupon(coupon: COUPON): Promise<void>;
  removeCoupon(coupon: COUPON, customQuery: CustomQuery): Promise<void>;
  loadCart(): Promise<void>;
  loadCart(customQuery: CustomQuery): Promise<void>;
  loading: ComputedProperty<boolean>;
}

export interface UseWishlist
<
  WISHLIST,
  WISHLIST_ITEM,
  PRODUCT,
> {
  wishlist: ComputedProperty<WISHLIST>;
  addToWishlist: (product: PRODUCT) => Promise<void>;
  isOnWishlist: (product: PRODUCT) => boolean;
  removeFromWishlist: (product: WISHLIST_ITEM,) => Promise<void>;
  clearWishlist: () => Promise<void>;
  loadWishlist: () => Promise<void>;
  loading: ComputedProperty<boolean>;
}

export interface UseCompare<PRODUCT> {
  compare: ComputedProperty<PRODUCT[]>;
  addToCompare: (product: PRODUCT) => Promise<void>;
  removeFromCompare: (product: PRODUCT) => Promise<void>;
  clearCompare: () => Promise<void>;
  loading: ComputedProperty<boolean>;
}

export interface UseCheckout
<
  PAYMENT_METHODS,
  SHIPPING_METHODS,
  PERSONAL_DETAILS,
  SHIPPING_DETAILS,
  BILLING_DETAILS,
  CHOOSEN_PAYMENT_METHOD,
  CHOOSEN_SHIPPING_METHOD,
  PLACE_ORDER,
> {
  paymentMethods: Ref<PAYMENT_METHODS>;
  shippingMethods: Ref<SHIPPING_METHODS>;
  personalDetails: PERSONAL_DETAILS;
  shippingDetails: SHIPPING_DETAILS;
  billingDetails: BILLING_DETAILS;
  chosenPaymentMethod: CHOOSEN_PAYMENT_METHOD;
  chosenShippingMethod: CHOOSEN_SHIPPING_METHOD;
  placeOrder: PLACE_ORDER;
  loading: ComputedProperty<boolean>;
}

export interface UseReview<REVIEW, REVIEWS_SEARCH_PARAMS, REVIEW_ADD_PARAMS> {
  search(params: REVIEWS_SEARCH_PARAMS): Promise<void>;
  search(params: REVIEWS_SEARCH_PARAMS, customQuery: CustomQuery): Promise<void>;
  addReview(params: REVIEW_ADD_PARAMS): Promise<void>;
  addReview(params: REVIEW_ADD_PARAMS, customQuery: CustomQuery): Promise<void>;
  reviews: ComputedProperty<REVIEW>;
  loading: ComputedProperty<boolean>;
  [x: string]: any;
}

export interface UseFacet<SEARCH_DATA> {
  result: ComputedProperty<FacetSearchResult<SEARCH_DATA>>;
  loading: ComputedProperty<boolean>;
  search: (params?: AgnosticFacetSearchParams) => Promise<void>;
}

export interface ProductGetters<PRODUCT, PRODUCT_FILTER> {
  getName: (product: PRODUCT) => string;
  getSlug: (product: PRODUCT) => string;
  getPrice: (product: PRODUCT) => AgnosticPrice;
  getGallery: (product: PRODUCT) => AgnosticMediaGalleryItem[];
  getCoverImage: (product: PRODUCT) => string;
  getFiltered: (products: PRODUCT[], filters?: PRODUCT_FILTER) => PRODUCT[];
  getAttributes: (products: PRODUCT[] | PRODUCT, filters?: Array<string>) => Record<string, AgnosticAttribute | string>;
  getDescription: (product: PRODUCT) => string;
  getCategoryIds: (product: PRODUCT) => string[];
  getId: (product: PRODUCT) => string;
  getFormattedPrice: (price: number) => string;
  getTotalReviews: (product: PRODUCT) => number;
  getAverageRating: (product: PRODUCT) => number;
  getBreadcrumbs?: (product: PRODUCT) => AgnosticBreadcrumb[];
  [getterName: string]: any;
}

export interface CartGetters<CART, CART_ITEM> {
  getItems: (cart: CART) => CART_ITEM[];
  getItemName: (cartItem: CART_ITEM) => string;
  getItemImage: (cartItem: CART_ITEM) => string;
  getItemPrice: (cartItem: CART_ITEM) => AgnosticPrice;
  getItemQty: (cartItem: CART_ITEM) => number;
  getItemAttributes: (cartItem: CART_ITEM, filters?: Array<string>) => Record<string, AgnosticAttribute | string>;
  getItemSku: (cartItem: CART_ITEM) => string;
  getTotals: (cart: CART) => AgnosticTotals;
  getShippingPrice: (cart: CART) => number;
  getTotalItems: (cart: CART) => number;
  getFormattedPrice: (price: number) => string;
  getCoupons: (cart: CART) => AgnosticCoupon[];
  [getterName: string]: (element: any, options?: any) => unknown;
}

export interface WishlistGetters<WISHLIST, WISHLIST_ITEM> {
  getItems: (wishlist: WISHLIST) => WISHLIST_ITEM[];
  getItemName: (wishlistItem: WISHLIST_ITEM) => string;
  getItemImage: (wishlistItem: WISHLIST_ITEM) => string;
  getItemPrice: (wishlistItem: WISHLIST_ITEM) => AgnosticPrice;
  getItemAttributes: (wishlistItem: WISHLIST_ITEM, filters?: Array<string>) => Record<string, AgnosticAttribute | string>;
  getItemSku: (wishlistItem: WISHLIST_ITEM) => string;
  getTotals: (wishlist: WISHLIST) => AgnosticTotals;
  getTotalItems: (wishlist: WISHLIST) => number;
  getFormattedPrice: (price: number) => string;
  [getterName: string]: (element: any, options?: any) => unknown;
}

export interface CategoryGetters<CATEGORY> {
  getTree: (category: CATEGORY) => AgnosticCategoryTree | null;
  getBreadcrumbs?: (category: CATEGORY) => AgnosticBreadcrumb[];
  [getterName: string]: any;
}

export interface UserGetters<USER> {
  getFirstName: (customer: USER) => string;
  getLastName: (customer: USER) => string;
  getFullName: (customer: USER) => string;
  getEmailAddress: (customer: USER) => string;
  [getterName: string]: (element: any, options?: any) => unknown;
}

export interface CheckoutGetters<SHIPPING_METHOD> {
  getShippingMethodId: (shippingMethod: SHIPPING_METHOD) => string;
  getShippingMethodName: (shippingMethod: SHIPPING_METHOD) => string;
  getShippingMethodDescription: (shippingMethod: SHIPPING_METHOD) => string;
  getShippingMethodPrice: (shippingMethod: SHIPPING_METHOD) => number;
  getFormattedPrice: (price: number) => string;
  [getterName: string]: (element: any, options?: any) => unknown;
}

export interface UserOrderGetters<ORDER, ORDER_ITEM> {
  getDate: (order: ORDER) => string;
  getId: (order: ORDER) => string;
  getStatus: (order: ORDER) => string;
  getPrice: (order: ORDER) => number;
  getItems: (order: ORDER) => ORDER_ITEM[];
  getItemSku: (item: ORDER_ITEM) => string;
  getItemName: (item: ORDER_ITEM) => string;
  getItemQty: (item: ORDER_ITEM) => number;
  getFormattedPrice: (price: number) => string;
  [getterName: string]: (element: any, options?: any) => unknown;
}

export interface ReviewGetters<REVIEW, REVIEW_ITEM> {
  getItems: (review: REVIEW) => REVIEW_ITEM[];
  getReviewId: (item: REVIEW_ITEM) => string;
  getReviewAuthor: (item: REVIEW_ITEM) => string;
  getReviewMessage: (item: REVIEW_ITEM) => string;
  getReviewRating: (item: REVIEW_ITEM) => number;
  getReviewDate: (item: REVIEW_ITEM) => string;
  getTotalReviews: (review: REVIEW) => number;
  getAverageRating: (review: REVIEW) => number;
  getRatesCount: (review: REVIEW) => AgnosticRateCount[];
  getReviewsPage: (review: REVIEW) => number;
}

export interface FacetsGetters<SEARCH_DATA, RESULTS, CRITERIA = any> {
  getAll: (searchData: FacetSearchResult<SEARCH_DATA>, criteria?: CRITERIA) => AgnosticFacet[];
  getGrouped: (searchData: FacetSearchResult<SEARCH_DATA>, criteria?: CRITERIA) => AgnosticGroupedFacet[];
  getCategoryTree: (searchData: FacetSearchResult<SEARCH_DATA>) => AgnosticCategoryTree;
  getSortOptions: (searchData: FacetSearchResult<SEARCH_DATA>) => AgnosticSort;
  getProducts: (searchData: FacetSearchResult<SEARCH_DATA>) => RESULTS;
  getPagination: (searchData: FacetSearchResult<SEARCH_DATA>) => AgnosticPagination;
  getBreadcrumbs: (searchData: FacetSearchResult<SEARCH_DATA>) => AgnosticBreadcrumb[];
  [getterName: string]: (element: any, options?: any) => unknown;
}

export interface AgnosticCoupon {
  id: string;
  name: string;
  code: string;
  value: number;
}

export interface AgnosticMediaGalleryItem {
  small: string;
  normal: string;
  big: string;
}

export interface AgnosticCategoryTree {
  label: string;
  slug?: string;
  items: AgnosticCategoryTree[];
  isCurrent: boolean;
  count?: number;
  [x: string]: unknown;
}

export interface AgnosticPrice {
  regular: number | null;
  special?: number | null;
}

export interface AgnosticTotals {
  total: number;
  subtotal: number;
  [x: string]: unknown;
}

export interface AgnosticAttribute {
  name?: string;
  value: string | Record<string, any>;
  label: string;
}

export interface AgnosticProductReview {
  id: string;
  author: string;
  date: Date;
  message: string | null;
  rating: number | null;
}

export interface AgnosticLocale {
  code: string;
  label: string;
  [x: string]: unknown;
}

export interface AgnosticCountry {
  code: string;
  label: string;
  [x: string]: unknown;
}

export interface AgnosticCurrency {
  code: string;
  label: string;
  prefixSign: boolean;
  sign: string;
  [x: string]: unknown;
}

export interface AgnosticBreadcrumb {
  text: string;
  link: string;
}

export interface AgnosticSortByOption {
  label: string;
  value: string;
  [x: string]: unknown;
}

export interface AgnosticRateCount {
  rate: number;
  count: number;
}

// TODO - remove this interface
export enum AgnosticOrderStatus {
  Open = 'Open',
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Shipped = 'Shipped',
  Complete = 'Complete',
  Cancelled = 'Cancelled',
  Refunded = 'Refunded'
}

export interface AgnosticFacet {
  type: string;
  id: string;
  value: any;
  attrName?: string;
  count?: number;
  selected?: boolean;
  metadata?: any;
}

export interface AgnosticGroupedFacet {
  id: string;
  label: string;
  count?: number;
  options: AgnosticFacet[];
}

export interface AgnosticSort {
  options: AgnosticFacet[];
  selected: string;
}

export interface AgnosticPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  pageOptions: number[];
}

export interface FacetSearchResult<S> {
  data: S;
  input: AgnosticFacetSearchParams;
}

export interface AgnosticFacetSearchParams {
  categorySlug?: string;
  rootCatSlug?: string;
  term?: string;
  page?: number;
  itemsPerPage?: number;
  sort?: string;
  filters?: Record<string, string[]>;
  metadata?: any;
  [x: string]: any;
}

export interface VSFLogger {
  debug(message?: any, ...args: any): void;
  info(message?: any, ...args: any): void;
  warn(message?: any, ...args: any): void;
  error(message?: any, ...args: any): void;
}
