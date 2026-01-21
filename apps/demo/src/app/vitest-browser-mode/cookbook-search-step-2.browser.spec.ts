import { TestBed } from '@angular/core/testing';
import { screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CookbookSearch } from './cookbook-search.ng';
import { Cart } from './cart';

describe(CookbookSearch.name, () => {
  it('filters recipes by authors name', async () => {
    TestBed.createComponent(CookbookSearch);

    await userEvent.type(
      await screen.findByRole('textbox', { name: 'Keywords' }),
      'Marmicode',
    );

    const getHeadings = () => screen.getAllByRole('heading');
    await expect.poll(() => getHeadings()).toHaveLength(3);
    const headings = getHeadings();
    await expect
      .element(headings[0])
      .toHaveTextContent('Angular Testing Cookbook');
    await expect
      .element(headings[1])
      .toHaveTextContent('Angular Core Cookbook');
    await expect.element(headings[2]).toHaveTextContent('Nx Cookbook');
  });

  it('adds first cookbook (Angular Testing Cookbook) to the cart', async () => {
    const cart = TestBed.inject(Cart);
    TestBed.createComponent(CookbookSearch);

    const addToCartButtons = await screen.findAllByRole('button', {
      name: 'Add to Cart',
    });
    await userEvent.click(addToCartButtons[0]);

    expect(cart.cookbooks()).toMatchObject([
      { title: 'Angular Testing Cookbook' },
    ]);
  });
});
