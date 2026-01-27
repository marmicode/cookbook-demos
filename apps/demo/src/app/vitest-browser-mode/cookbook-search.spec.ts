import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { Cart } from './cart';
import { CookbookSearch } from './cookbook-search.ng';

describe(CookbookSearch.name, () => {
  it('filters cookbooks by author name', async () => {
    TestBed.createComponent(CookbookSearch);

    await page.getByRole('textbox', { name: 'Keywords' }).fill('Marmicode');

    const headings = page.getByRole('heading');
    await expect.element(headings).toHaveLength(3);
    await expect
      .element(headings.nth(0))
      .toHaveTextContent('Angular Testing Cookbook');
    await expect
      .element(headings.nth(1))
      .toHaveTextContent('Angular Core Cookbook');
    await expect.element(headings.nth(2)).toHaveTextContent('Nx Cookbook');
  });

  it('adds cookbook to the cart when user clicks on "Add to Cart" button', async () => {
    const cart = TestBed.inject(Cart);
    TestBed.createComponent(CookbookSearch);

    await page
      .getByRole('article')
      .filter({ hasText: 'Angular Testing Cookbook' })
      .getByRole('button', { name: 'Add to Cart' })
      .click();

    expect(cart.cookbooks()).toMatchObject([
      {
        title: 'Angular Testing Cookbook',
      },
    ]);
  });
});
