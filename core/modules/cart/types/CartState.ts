export default interface CartState {
  itemsAfterPlatformTotals: any,
  platformTotals: any,
  platformTotalSegments: any,
  cartIsLoaded: boolean,
  cartServerPullAt: number,
  cartServerTotalsAt: number,
  cartServerCreatedAt: number,
  cartServerMethodsRefreshAt: number,
  cartServerBypassAt: number,
  cartSavedAt: number,
  bypassToAnon: boolean,
  cartServerToken: string,
  shipping: any,
  payment: any,
  cartItemsHash: string,
  bypassCount: number,
  cartItems: any[]
}
