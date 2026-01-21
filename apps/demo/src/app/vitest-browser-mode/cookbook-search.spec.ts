import { TestBed } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';
import { CookbookSearch } from './cookbook-search.ng';
import { screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';

describe(CookbookSearch.name, () => {
  it('filters cookbooks by author name', async () => {
    TestBed.createComponent(CookbookSearch);

    const keywordsEl = await screen.findByRole('textbox', { name: 'Keywords' });
    await userEvent.type(keywordsEl, 'Marmicode');

    expect(await screen.findAllByRole('heading')).toHaveLength(3);
  });

  it.todo('adds cookbook to the cart when user clicks on "Add to Cart" button');
});
