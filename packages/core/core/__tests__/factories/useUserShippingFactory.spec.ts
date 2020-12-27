import { useUserShippingFactory } from '../../src/factories';

const factoryParams = {
  addAddress: jest.fn(() => null),
  deleteAddress: jest.fn(),
  updateAddress: jest.fn(),
  load: jest.fn(),
  setDefaultAddress: jest.fn()
};

const { useUserShipping } = useUserShippingFactory(factoryParams);
const useUserShippingMethods = useUserShipping();

describe('[CORE - factories] useUserShippingFactory', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have proper initial properties', () => {
    const { useUserShipping } = useUserShippingFactory(factoryParams);
    const {
      shipping,
      loading
    } = useUserShipping();

    expect(shipping.value).toEqual({});
    expect(loading.value).toEqual(false);
  });

  describe('methods', () => {
    describe('addAddress', () => {
      it('updates addresses', async () => {
        const paramsToUpdate = { name: 'Test'};
        factoryParams.addAddress.mockReturnValueOnce(paramsToUpdate);
        await useUserShippingMethods.addAddress({ address: paramsToUpdate });
        expect(useUserShippingMethods.shipping.value).toEqual(paramsToUpdate);
      });

      it('throws error', async () => {
        factoryParams.addAddress.mockImplementationOnce(() => {
          throw new Error();
        });
        await expect(useUserShippingMethods.addAddress('' as any)).rejects.toThrow();
      });

      it('finally loading go to false', () => {
        expect(useUserShippingMethods.loading.value).toBe(false);
      });
    });

    describe('deleteAddress', () => {
      it('updates addresses', async () => {
        const paramsToUpdate = { name: 'Test'};
        factoryParams.deleteAddress.mockReturnValueOnce(paramsToUpdate);
        await useUserShippingMethods.deleteAddress({ address: paramsToUpdate });
        expect(useUserShippingMethods.shipping.value).toEqual(paramsToUpdate);
      });

      it('throws error', async () => {
        factoryParams.deleteAddress.mockImplementationOnce(() => {
          throw new Error();
        });
        await expect(useUserShippingMethods.deleteAddress('' as any)).rejects.toThrow();
      });

      it('finally loading go to false', () => {
        expect(useUserShippingMethods.loading.value).toBe(false);
      });
    });

    describe('updateAddress', () => {
      it('updates addresses', async () => {
        const paramsToUpdate = { name: 'Test'};
        factoryParams.updateAddress.mockReturnValueOnce(paramsToUpdate);
        await useUserShippingMethods.updateAddress({ address: paramsToUpdate });
        expect(useUserShippingMethods.shipping.value).toEqual(paramsToUpdate);
      });

      it('throws error', async () => {
        factoryParams.updateAddress.mockImplementationOnce(() => {
          throw new Error();
        });
        await expect(useUserShippingMethods.updateAddress('' as any)).rejects.toThrow();
      });

      it('finally loading go to false', () => {
        expect(useUserShippingMethods.loading.value).toBe(false);
      });
    });

    describe('load', () => {
      it('updates addresses', async () => {
        const paramsToUpdate = { name: 'Test'};
        factoryParams.load.mockReturnValueOnce(paramsToUpdate);
        await useUserShippingMethods.load();
        expect(useUserShippingMethods.shipping.value).toEqual(paramsToUpdate);
      });

      it('throws error', async () => {
        factoryParams.load.mockImplementationOnce(() => {
          throw new Error();
        });
        await expect(useUserShippingMethods.load()).rejects.toThrow();
      });

      it('finally loading go to false', () => {
        expect(useUserShippingMethods.loading.value).toBe(false);
      });
    });

    describe('setDefaultAddress', () => {
      it('updates addresses', async () => {
        const paramsToUpdate = { name: 'Test'};
        factoryParams.setDefaultAddress.mockReturnValueOnce(paramsToUpdate);
        await useUserShippingMethods.setDefaultAddress({ address: paramsToUpdate });
        expect(useUserShippingMethods.shipping.value).toEqual(paramsToUpdate);
      });

      it('throws error', async () => {
        factoryParams.setDefaultAddress.mockImplementationOnce(() => {
          throw new Error();
        });
        await expect(useUserShippingMethods.setDefaultAddress('' as any)).rejects.toThrow();
      });

      it('finally loading go to false', () => {
        expect(useUserShippingMethods.loading.value).toBe(false);
      });
    });
  });
});
