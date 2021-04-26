import { apiClientFactory } from '../../src/factories/apiClientFactory';
import { applyContextToApi } from '../../src/factories/apiClientFactory/context';

jest.mock('../../src/utils', () => ({
  integrationPluginFactory: jest.fn(),
  Logger: {
    debug: jest.fn()
  }
}));

describe('[CORE - factories] apiClientFactory', () => {
  it('Should return passed config with overrides property', async () => {
    const params = {
      onCreate: jest.fn((config) => ({ config })),
      defaultSettings: { option: 'option' }
    };

    const { createApiClient } = apiClientFactory<any, any>(params as any) as any;

    const { settings } = await createApiClient({});
    expect(settings).toEqual({});
  });

  it('Should merge with default settings when setup is called', async () => {
    const params = {
      onCreate: jest.fn((config) => ({ config })),
      defaultSettings: { option: 'option' }
    };

    const { createApiClient} = apiClientFactory<any, any>(params as any) as any;

    const { settings } = await createApiClient({ newOption: 'newOption'});

    expect(settings).toEqual({
      newOption: 'newOption'
    });
  });

  it('Should run onCreate when setup is invoked', async () => {
    const params = {
      onCreate: jest.fn((config) => ({ config })),
      defaultSettings: {}
    };

    const { createApiClient } = apiClientFactory<any, any>(params as any);

    await createApiClient({});

    expect(params.onCreate).toHaveBeenCalled();
  });

  it('Should run given extensions', async () => {
    const beforeCreate = jest.fn(a => a);
    const afterCreate = jest.fn(a => a);
    const extension = {
      name: 'extTest',
      hooks: () => ({ beforeCreate, afterCreate })
    };

    const params = {
      onCreate: jest.fn((config) => ({ config })),
      defaultSettings: {},
      extensions: [extension]
    };

    const { createApiClient } = apiClientFactory<any, any>(params as any);
    const extensions = (createApiClient as any)._predefinedExtensions;

    await createApiClient.bind({ middleware: { req: null, res: null, extensions } })({});

    expect(beforeCreate).toHaveBeenCalled();
    expect(afterCreate).toHaveBeenCalled();
  });

  it('applyContextToApi adds context as first argument to api functions', async () => {
    const api = {
      firstFunc: jest.fn(),
      secondFunc: jest.fn(),
      thirdFunc: jest.fn()
    };
    const context = {
      extendQuery: jest.fn()
    };

    const apiWithContext: any = applyContextToApi(api, context);

    await apiWithContext.firstFunc();
    await apiWithContext.secondFunc('TEST');
    await apiWithContext.thirdFunc('A', 'FEW', 'ARGS');

    expect(api.firstFunc).toHaveBeenCalledWith(
      expect.objectContaining({ extendQuery: expect.any(Function) })
    );
    expect(api.secondFunc).toHaveBeenCalledWith(
      expect.objectContaining({ extendQuery: expect.any(Function) }),
      'TEST'
    );
    expect(api.thirdFunc).toHaveBeenCalledWith(
      expect.objectContaining({ extendQuery: expect.any(Function) }),
      'A', 'FEW', 'ARGS'
    );
  });
});
