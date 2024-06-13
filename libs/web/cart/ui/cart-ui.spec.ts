import { cartUi } from './cart-ui';

describe(cartUi.name, () => {
  it('should work', () => {
    expect(cartUi()).toBe('cart-ui');
  });
});
