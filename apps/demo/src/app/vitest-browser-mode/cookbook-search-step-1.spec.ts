import { TestBed } from '@angular/core/testing';
import { screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
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
});
