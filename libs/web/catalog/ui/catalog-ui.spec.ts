import { catalogUi } from './catalog-ui';

describe(catalogUi.name, () => {
  it('should work', () => {
    expect(catalogUi()).toEqual('catalog-ui');
  });
});
