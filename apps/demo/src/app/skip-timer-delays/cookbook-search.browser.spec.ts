import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { setUpTimeMachine } from '../../testing/time-machine';
import { CookbookSearch } from './cookbook-search.ng';

describe(CookbookSearch.name, () => {
  it(`filters recipes by author's name`, async () => {
    setUpTimeMachine().fastForward();

    TestBed.createComponent(CookbookSearch);

    await page
      .getByRole('textbox', { name: 'Keywords' })
      .fill('Angular Testing');

    /* There should be a single cookbook in the search results. */
    await expect
      .element(page.getByRole('heading'))
      .toHaveTextContent('Angular Testing Cookbook');
  });
});
