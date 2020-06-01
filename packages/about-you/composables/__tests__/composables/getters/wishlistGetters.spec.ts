import {
  getWishlistTotals,
  getWishlistItems,
  getWishlistItemName,
  getWishlistItemImage,
  getWishlistItemPrice,
  getWishlistItemAttributes,
  getWishlistItemSku,
  getWishlistTotalItems
} from '../../../src/composables/getters/wishlistGetters';

import {
  getProductCoverImage,
  getProductName,
  getProductPrice,
  getProductId,
  getProductAttributes
} from '../../../src/composables/getters/productGetters';

jest.mock('../../../src/composables/getters/productGetters', () => ({
  getProductCoverImage: jest.fn(),
  getProductName: jest.fn(),
  getProductPrice: jest.fn(),
  getFormattedPrice: jest.fn(),
  getProductId: jest.fn(),
  getProductAttributes: jest.fn()
}));

const wishlist = {
  key: '1111-2222-3333-4444-1589274233364',
  items: [
    {
      key: 'a1bac123ab1b213ab2131b89ba76ad71',
      quantity: 1,
      variant: {
        id: 38346771,
        referenceKey: '578902-00-0',
        price: {
          withTax: 13626,
          withoutTax: 11450,
          tax: {
            vat: {
              amount: 2176,
              rate: 0.19
            }
          }
        }
      },
      product: {
        id: 3769863,
        masterKey: '578902-00_M',
        referenceKey: '578902-00',
        attributes: {
          material: {
            id: 257,
            key: 'material',
            label: 'Material',
            values: {
              id: 73347,
              label: 'Cotton',
              value: 'cotton'
            }
          }
        },
        advancedAttributes: {
          productName: {
            id: 1529,
            key: 'productName',
            label: 'Product Name',
            type: '',
            values: [
              {
                fieldSet: [
                  [
                    {
                      value: 'T-Shirt Majestic Filatures grau'
                    }
                  ]
                ]
              }
            ]
          }
        },
        images: [
          {
            hash: 'images/99c12be1f8388824a1fa64d222c6f269',
            attributes: {
              imageBackground: {
                id: 1258,
                key: 'imageBackground',
                label: 'Bild Hintergrund',
                values: {
                  id: 66504,
                  label: 'weiß',
                  value: 'white'
                }
              }
            }
          }
        ],
        variants: [
          {
            id: 38346771,
            price: {
              withTax: 13626,
              withoutTax: 11450
            }
          }
        ],
        priceRange: {
          min: {
            withTax: 10900,
            withoutTax: 9160
          },
          max: {
            withTax: 13626,
            withoutTax: 11450
          }
        }
      }
    }
  ]
} as any;

describe('[about-you-composables] wishlist getters', () => {
  describe('getWishlistItems', () => {
    it('returns empty array when wishlist doesn\'t exist', () => {
      expect(getWishlistItems(null)).toEqual([]);
    });

    it('returns products existing in the wishlist', () => {
      expect(getWishlistItems(wishlist)).toEqual(wishlist.items);
    });
  });

  describe('getWishlistTotals', () => {
    it('returns wishlist total price', () => {
      expect(getWishlistTotals(null).total).toEqual(0);
      (getProductPrice as jest.Mock).mockReturnValueOnce({ regular: 1.11, special: null });
      expect(getWishlistTotals(wishlist).total).toEqual(1.11);
    });

    it('returns wishlist total special price', () => {
      (getProductPrice as jest.Mock).mockReturnValueOnce({ regular: 1.11, special: 1.10 });
      expect(getWishlistTotals(wishlist).total).toEqual(1.10);
    });

    it('returns wishlist subtotal price', () => {
      expect(getWishlistTotals(null).subtotal).toEqual(0);
      (getProductPrice as jest.Mock).mockReturnValueOnce({ regular: 1.11, special: null });
      expect(getWishlistTotals(wishlist).total).toEqual(1.11);
    });

    it('returns wishlist subtotal special price', () => {
      (getProductPrice as jest.Mock).mockReturnValueOnce({ regular: 1.11, special: 1.10 });
      expect(getWishlistTotals(wishlist).subtotal).toEqual(1.10);
    });

    it('returns the total price for several items', () => {
      const wishlistWithServalProducts = {
        key: '1',
        items: [
          wishlist.items[0],
          wishlist.items[0]
        ]
      };
      (getProductPrice as jest.Mock).mockReturnValue({ regular: 1.11, special: 1.10 });
      expect(getWishlistTotals(wishlistWithServalProducts).subtotal).toEqual(2.20);
    });
  });

  describe('getWishlistTotalItems', () => {
    it('returns wishlist total items', () => {
      expect(getWishlistTotalItems(null)).toEqual(0);
      expect(getWishlistTotalItems(wishlist)).toEqual(1);
    });
  });

  describe('getWishlistItemName', () => {
    it('returns wishlist product name', () => {
      expect(getWishlistItemName(null)).toEqual('');
      (getProductName as jest.Mock).mockReturnValueOnce('T-Shirt Majestic Filatures grau');
      expect(getWishlistItemName(wishlist.items[0])).toEqual('T-Shirt Majestic Filatures grau');
    });
  });

  describe('getWishlistItem', () => {
    it('returns wishlist product image', () => {
      expect(getWishlistItemImage(null)).toEqual('');
      (getProductCoverImage as jest.Mock).mockReturnValueOnce('domain.tld/image.jpg');
      expect(getWishlistItemImage(wishlist.items[0])).toEqual('domain.tld/image.jpg');
    });
  });

  describe('getWishlistItemPrice', () => {
    it('returns wishlist product price', () => {
      expect(getWishlistItemPrice(null)).toEqual({ regular: 0, special: 0 });
      (getProductPrice as jest.Mock).mockReturnValueOnce({ regular: 1.11, special: 1.11 });
      expect(getWishlistItemPrice(wishlist.items[0])).toEqual({ regular: 1.11, special: 1.11 });
    });
  });

  describe('getWishlistItemAttributes', () => {
    it('returns wishlist product attributes', () => {
      expect(
        getWishlistItemAttributes(null, ['material'])
      ).toEqual([]);

      const args = {
        material: {
          name: 'material',
          label: 'Material',
          value: 'silk'
        }
      };
      (getProductAttributes as jest.Mock).mockReturnValueOnce(args);

      expect(
        getWishlistItemAttributes(wishlist.items[0], ['material'])
      ).toEqual(args);
    });
  });

  describe('getWishlistItemSku', () => {
    it('returns wishlist product sku', () => {
      expect(getWishlistItemSku(null)).toEqual('');
      (getProductId as jest.Mock).mockReturnValueOnce('1234');
      expect(getWishlistItemSku(wishlist.items[0])).toEqual('1234');
    });
  });
});
