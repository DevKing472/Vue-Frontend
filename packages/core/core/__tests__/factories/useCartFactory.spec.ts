import { useCartFactory, UseCartFactoryParams } from '../../src/factories';
import { UseCart } from '../../src/types';
import { sharedRef } from './../../src/utils';

let useCart: () => UseCart<any, any, any, any>;
let params: UseCartFactoryParams<any, any, any, any>;

const customQuery = undefined;

function createComposable() {
  params = {
    load: jest.fn().mockResolvedValueOnce({ id: 'mocked_cart' }),
    addItem: jest.fn().mockResolvedValueOnce({ id: 'mocked_added_cart' }),
    removeItem: jest
      .fn()
      .mockResolvedValueOnce({ id: 'mocked_removed_cart' }),
    updateItemQty: jest
      .fn()
      .mockResolvedValueOnce({ id: 'mocked_updated_quantity_cart' }),
    clear: jest.fn().mockResolvedValueOnce({ id: 'mocked_cleared_cart' }),
    applyCoupon: jest.fn().mockResolvedValueOnce({
      updatedCart: { id: 'mocked_apply_coupon_cart' },
      updatedCoupon: 'appliedCouponMock'
    }),
    removeCoupon: jest.fn().mockResolvedValueOnce({
      updatedCart: { id: 'mocked_removed_coupon_cart' }
    }),
    isOnCart: jest.fn().mockReturnValueOnce(true)
  };
  const factory = useCartFactory<any, any, any, any>(params);
  useCart = factory.useCart;
}

describe('[CORE - factories] useCartFactory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    createComposable();
  });

  describe('initial setup', () => {
    it('should have proper initial properties', async () => {
      const { cart, loading } = useCart();

      expect(cart.value).toEqual(null);
      expect(loading.value).toEqual(false);
    });

    it('should not load cart if is provided during factory creation', () => {
      createComposable();
      useCart();
      expect(params.load).not.toBeCalled();
    });
    it('set given cart', () => {
      const { cart, setCart } = useCart();
      expect(cart.value).toEqual(null);
      setCart({ cart: 'test' });
      expect(sharedRef).toHaveBeenCalled();
    });
  });

  describe('computes', () => {
    describe('isOnCart', () => {
      it('should invoke implemented isOnCart method', () => {
        const { isOnCart } = useCart();
        const result = isOnCart({ id: 'productId' });
        expect(result).toEqual(true);
        expect(params.isOnCart).toBeCalledWith({ context: null }, {
          currentCart: null,
          product: { id: 'productId' }
        });
      });
    });
  });

  describe('methods', () => {
    describe('load', () => {
      it('load the cart', async () => {
        createComposable();

        const { load, cart } = useCart();
        await load();
        await load();
        expect(params.load).toHaveBeenCalled();
        expect(cart.value).toEqual({ id: 'mocked_cart' });
      });
    });

    describe('addItem', () => {
      it('should invoke adding to cart', async () => {
        const { addItem, cart } = useCart();
        await addItem({ id: 'productId' }, 2);
        expect(params.addItem).toHaveBeenCalledWith({ context: null }, {
          currentCart: null,
          product: { id: 'productId' },
          quantity: 2
        }, customQuery);
        expect(cart.value).toEqual({ id: 'mocked_added_cart' });
      });
    });

    describe('removeItem', () => {
      it('should invoke adding to cart', async () => {
        const { removeItem, cart } = useCart();
        await removeItem({ id: 'productId' });
        expect(params.removeItem).toHaveBeenCalledWith({ context: null }, {
          currentCart: null,
          product: { id: 'productId' }
        }, customQuery);
        expect(cart.value).toEqual({ id: 'mocked_removed_cart' });
      });
    });

    describe('updateItemQty', () => {
      it('should not invoke quantity update if quantity is not provided', async () => {
        const { updateItemQty } = useCart();
        await updateItemQty({ id: 'productId' });
        expect(params.updateItemQty).not.toBeCalled();
      });

      it('should not invoke quantity update if quantity is lower than 1', async () => {
        const { updateItemQty } = useCart();
        await updateItemQty({ id: 'productId' }, 0);
        expect(params.updateItemQty).not.toBeCalled();
      });

      it('should invoke quantity update', async () => {
        const { updateItemQty, cart } = useCart();
        await updateItemQty({ id: 'productId' }, 2);
        expect(params.updateItemQty).toHaveBeenCalledWith({ context: null }, {
          currentCart: null,
          product: { id: 'productId' },
          quantity: 2
        }, customQuery);
        expect(cart.value).toEqual({ id: 'mocked_updated_quantity_cart' });
      });
    });

    describe('clear', () => {
      it('should invoke clear', async () => {
        const { clear, cart } = useCart();
        await clear();
        expect(params.clear).toHaveBeenCalledWith({ context: null }, { currentCart: null });
        expect(cart.value).toEqual({ id: 'mocked_cleared_cart' });
      });
    });

    describe('applyCoupon', () => {
      it('should apply provided coupon', async () => {
        const { applyCoupon, cart } = useCart();
        await applyCoupon('qwerty');
        expect(params.applyCoupon).toHaveBeenCalledWith({ context: null }, {
          currentCart: null,
          couponCode: 'qwerty'
        }, customQuery);
        expect(cart.value).toEqual({ id: 'mocked_apply_coupon_cart' });
      });
    });

    describe('removeCoupon', () => {
      it('should remove existing coupon', async () => {
        const { removeCoupon, cart } = useCart();
        const coupon = 'some-coupon-code-12321231';
        await removeCoupon(coupon);
        expect(params.removeCoupon).toHaveBeenCalledWith({ context: null }, {
          currentCart: null,
          coupon
        }, customQuery);
        expect(cart.value).toEqual({ id: 'mocked_removed_coupon_cart' });
      });

      // TODO
      // it('should not invoke removeCoupon method if coupon is not applied', async () => {
      // });
    });
  });
});
