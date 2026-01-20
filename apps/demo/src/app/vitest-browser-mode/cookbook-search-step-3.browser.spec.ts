import { TestBed } from '@angular/core/testing';
import { screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { Cart } from './cart';
import { CookbookSearch } from './cookbook-search.ng';

describe(CookbookSearch.name, () => {
  it('filters recipes by authors name', async () => {
    TestBed.createComponent(CookbookSearch);

    await userEvent.type(
      await screen.findByRole('textbox', { name: 'Keywords' }),
      'Marmicode',
    );

    await expect.poll(() => screen.getAllByRole('heading')).toHaveLength(3);
  });

  it('adds first cookbook (Angular Testing Cookbook) to the cart', async () => {
    TestBed.createComponent(CookbookSearch);

    const addToCartButtons = await screen.findAllByRole('button', {
      name: 'Add to Cart',
    });
    await userEvent.click(addToCartButtons[0]);

    expect(TestBed.inject(Cart).cookbooks()).toMatchObject([
      {
        title: 'Angular Testing Cookbook',
      },
    ]);
  });
});
