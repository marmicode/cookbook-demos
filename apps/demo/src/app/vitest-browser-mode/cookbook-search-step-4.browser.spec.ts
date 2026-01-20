import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { Cart } from './cart';
import { CookbookSearch } from './cookbook-search.ng';

describe(CookbookSearch.name, () => {
  it('filters recipes by authors name', async () => {
    TestBed.createComponent(CookbookSearch);

    await page.getByRole('textbox', { name: 'Keywords' }).fill('Marmicode');

    await expect.poll(() => page.getByRole('heading')).toHaveLength(3);
  });

  it('adds first cookbook (Angular Testing Cookbook) to the cart', async () => {
    const cart = TestBed.inject(Cart);
    TestBed.createComponent(CookbookSearch);

    await page.getByRole('button', { name: 'Add to Cart' }).first().click();

    expect(cart.cookbooks()).toMatchObject([
      { title: 'Angular Testing Cookbook' },
    ]);
  });
});
