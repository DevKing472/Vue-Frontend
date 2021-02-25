import { CustomQuery } from '@vue-storefront/core';
import { ApolloQueryResult } from 'apollo-client';
import { FetchResult } from 'apollo-link';
import { Token, CustomerCredentials } from './setup';
import { UpdateCartParams } from '../api/updateCart';
import { GetMeParams } from '../api/getMe';
import { ShippingMethodData } from '../api/getShippingMethods';
import {
  Cart,
  Order,
  ShippingMethod,
  CustomerSignInResult,
  Customer,
  CartDraft,
  ProductVariant,
  OrderMyCartCommand,
  CustomerSignMeInDraft,
  CustomerSignMeUpDraft,
  ReferenceInput,
  Address,
  LineItem,
  CategoryQueryResult,
  ProductQueryResult,
  Me,
  CartQueryInterface
} from './GraphQL';

export interface ApiInstance {
  addToCart ({ id, version }: Cart, product: ProductVariant, quantity: number, customQuery?: CustomQuery): Promise<CartResponse>;
  applyCartCoupon (cart: Cart, discountCode: string, customQuery?: CustomQuery): Promise<CartResponse>;
  createCart (cartDraft?: CartData, customQueryFn?: CustomQuery): Promise<{ data: CartQueryInterface }>;
  createMyOrderFromCart (draft: OrderMyCartCommand, customQueryFn?: CustomQuery): Promise<OrderMutationResponse>;
  customerChangeMyPassword (version: any, currentPassword: string, newPassword: string): Promise<ChangeMyPasswordResponse>;
  customerSignMeIn (draft: CustomerSignMeInDraft): Promise<SignInResponse>;
  customerSignMeUp (draft: CustomerSignMeUpDraft): Promise<SignInResponse>;
  customerSignOut (): Promise<void>;
  customerUpdateMe (currentUser, updatedUserData): Promise<any>;
  getCart (cartId: string): Promise<CartQueryResponse>;
  getCategory (params, customQueryFn?: CustomQuery): Promise<QueryResponse<'categories', CategoryQueryResult>>;
  getMe (params?: GetMeParams, customQueryFn?: CustomQuery): Promise<{ data: { me: Me } }>;
  getOrders (params, customQueryFn?: CustomQuery): Promise<{ data: { me: Me } }>;
  getProduct (params, customQueryFn?: CustomQuery): Promise<QueryResponse<'products', ProductQueryResult>>;
  getShippingMethods (cartId?: string, customQueryFn?: CustomQuery): Promise<ShippingMethodData>;
  removeCartCoupon (cart: Cart, discountCode: ReferenceInput, customQuery?: CustomQuery): Promise<CartResponse>;
  removeFromCart (cart: Cart, product: LineItem, customQuery?: CustomQuery): Promise<CartResponse>;
  updateCart (params: UpdateCartParams, customQueryFn?: CustomQuery): Promise<CartResponse>;
  updateCartQuantity (cart: Cart, product: LineItem, customQuery?: CustomQuery): Promise<CartResponse>;
  updateShippingDetails (cart: Cart, shippingDetails: Address, customQueryFn?: CustomQuery): Promise<CartResponse>;
  isGuest: () => boolean;
}

export interface BaseSearch {
  limit?: number;
  offset?: number;
  sort?: string[];
}

export interface ProductWhereSearch extends BaseSearch {
  catId?: string | string[];
  skus?: string[];
  slug?: string;
  id?: string;
  filters?: Filter[];
}

export interface Filter {
  type: AttributeType;
  name: string;
  value: any;
}

export interface FilterOption {
  label: string;
  value: string | number | boolean | [number, number] | [string, string];
  selected: boolean;
}

export interface CategoryWhereSearch extends BaseSearch {
  catId?: string;
  slug?: string;
}

export interface OrderWhereSearch extends BaseSearch {
  id?: string;
}

export enum AttributeType {
  STRING = 'StringAttribute',
  DATE = 'DateAttribute',
  DATETIME = 'DateTimeAttribute',
  TIME = 'TimeAttribute',
  NUMBER = 'NumberAttribute',
  ENUM = 'EnumAttribute',
  LOCALIZED_ENUM = 'LocalizedEnumAttribute',
  LOCALIZED_STRING = 'LocalizedStringAttribute',
  MONEY = 'MoneyAttribute',
  BOOLEAN = 'BooleanAttribute'
}
export interface FlowOptions {
  currentToken?: Token;
  customerCredentials?: CustomerCredentials;
  requireUserSession?: boolean;
}

export interface CartData extends Omit<CartDraft, 'currency'> {
  currency?: string;
}

export type QueryResponse<K extends string, V> = ApolloQueryResult<Record<K, V>>;
export type MutationResponse<K extends string, V> = FetchResult<Record<K, V>>;
export type CartQueryResponse = QueryResponse<'cart', Cart>;
export type OrderQueryResponse = QueryResponse<'order', Order>;
export type CartMutationResponse = MutationResponse<'cart', Cart>;
export type CartResponse = CartQueryResponse | CartMutationResponse;
export type OrderMutationResponse = MutationResponse<'order', Order>;
export type OrderResponse = OrderQueryResponse | OrderMutationResponse;
export type ShippingMethodsResponse = QueryResponse<'shippingMethods', ShippingMethod>;
export type SignInResponse = QueryResponse<'user', CustomerSignInResult>;
export type ChangeMyPasswordResponse = QueryResponse<'user', Customer>;
