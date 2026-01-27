import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi } from 'vitest';
import { Cart } from './cart';
import { CookbookSearch } from './cookbook-search.ng';
import { screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';

describe(CookbookSearch.name, () => {
  it('filters cookbooks by author name', async () => {
    TestBed.createComponent(CookbookSearch);

    const keywordsEl = await screen.findByRole('textbox', { name: 'Keywords' });
    await userEvent.type(keywordsEl, 'Marmicode');

    await vi.waitFor(async () => {
      const headings = screen.queryAllByRole('heading');
      expect(headings).toHaveLength(3);
      expect(headings[0]).toHaveTextContent('Angular Testing Cookbook');
      expect(headings[1]).toHaveTextContent('Angular Core Cookbook');
      expect(headings[2]).toHaveTextContent('Nx Cookbook');
    });
  });

  it('adds cookbook to the cart when user clicks on "Add to Cart" button', async () => {
    const cart = TestBed.inject(Cart);
    TestBed.createComponent(CookbookSearch);

    const addToCartButtons = await screen.findAllByRole('button', {
      name: 'Add to Cart',
    });
    await userEvent.click(addToCartButtons[0]);

    expect(cart.cookbooks()).toMatchObject([
      {
        title: 'Angular Testing Cookbook',
      },
    ]);
  });
});
