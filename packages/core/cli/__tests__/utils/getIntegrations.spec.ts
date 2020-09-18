import getIntegrations from '../../src/utils/getIntegrations';

const expectedIntegrations = ['commercetools'];

describe('[vsf-next-cli] getIntegrations', () => {
  it('gets dependencies from package.json and transform them to list of integrations with filtering', () => {
    const integrations = getIntegrations();
    expect(integrations.sort()).toEqual(expectedIntegrations.sort());
  });
});
