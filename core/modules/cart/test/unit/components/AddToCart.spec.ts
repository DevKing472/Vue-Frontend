import { mountMixinWithStore } from '@vue-storefront/unit-tests/utils';

import Product from '@vue-storefront/core/modules/catalog/types/Product';

import { AddToCart } from '../../../components/AddToCart';

describe('AddToCart', () => {
  it('addToCart dispatches addItem action', () => {
    const product = {} as any as Product;

    const storeMock = {
      modules: {
        cart: {
          actions: {
            addItem: jest.fn()
          },
          namespaced: true
        }
      }
    };

    const wrapper = mountMixinWithStore(AddToCart, storeMock, {
      propsData: { product }
    });

    (wrapper.vm as any).addToCart(product);

    expect(storeMock.modules.cart.actions.addItem).toBeCalledWith(
      expect.anything(),
      { productToAdd: product },
      undefined
    );
  });
});
