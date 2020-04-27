import { mapProductSearchByQueryParams } from '../../../src/helpers/product/mapProductSearchByQueryParams';

describe('[about-you-helpers] mapProductSearchByQueryParams', () => {
  it('returns empty products query given no params', async () => {
    const params = {};
    const expectedQuery = {
      with: {},
      where: {},
      sort: {},
      pagination: {}
    };

    const result = mapProductSearchByQueryParams(params);
    expect(result).toEqual(expectedQuery);
  });

  it('returns mapped products query for given params', async () => {
    const params = {
      catId: 1337,
      term: 'foo'
    };
    const expectedQuery = {
      with: {},
      where: {
        categoryId: params.catId,
        term: params.term
      },
      sort: {},
      pagination: {}
    };

    const result = mapProductSearchByQueryParams(params);
    expect(result).toEqual(expectedQuery);
  });
});
