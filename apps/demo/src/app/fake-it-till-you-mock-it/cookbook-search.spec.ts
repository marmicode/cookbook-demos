/* We are using the screen from DOM Testing Library because we don't
 * want Angular Testing Library to trigger change detection as that could
 * make us miss synchronization issues. */
import { TestBed } from '@angular/core/testing';
import { screen } from '@testing-library/dom';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import {
  CookbookRepositoryFake,
  provideCookbookRepositoryFake,
} from './cookbook-repository.fake';
import { CookbookSearch } from './cookbook-search.ng';
import { cookbookMother } from './core/cookbook.mother';

describe(CookbookSearch.name, () => {
  it('should search cookbooks without filter initially', async () => {
    await renderCookbookSearch();

    const els = await screen.findAllByRole('heading');
    expect.soft(els).toHaveLength(2);
    expect.soft(els[0]).toHaveTextContent('Ottolenghi Simple');
    expect.soft(els[1]).toHaveTextContent('Burgers 101');
  });

  it('should filter by keywords', async () => {
    const { typeKeywords } = await renderCookbookSearch();

    await typeKeywords('Ottolenghi');

    const els = await screen.findAllByRole('heading');
    expect.soft(els).toHaveLength(1);
    expect.soft(els[0]).toHaveTextContent('Ottolenghi Simple');
  });

  it('should show error message if the repository fails', async () => {
    const { typeKeywords } = await renderCookbookSearch();

    await typeKeywords(`Ottolenghi ${CookbookRepositoryFake.INVALID_TOKEN}`);

    expect.soft(screen.queryAllByRole('heading')).toHaveLength(0);
    expect
      .soft(await screen.findByRole('alert'))
      .toHaveTextContent('🙀 Oh no! Something went wrong.');
  });
});

async function renderCookbookSearch() {
  const ottolenghiSimple = cookbookMother
    .withBasicInfo('Ottolenghi Simple')
    .withAuthor('Ottolenghi')
    .build();
  const anotherCookbook = cookbookMother.withBasicInfo('Burgers 101').build();

  TestBed.configureTestingModule({
    providers: [provideCookbookRepositoryFake()],
  });

  const fake = TestBed.inject(CookbookRepositoryFake);
  fake.configure({
    cookbooks: [ottolenghiSimple, anotherCookbook],
  });

  TestBed.createComponent(CookbookSearch);

  return {
    async typeKeywords(keywords: string) {
      return await userEvent.type(
        await screen.findByRole('textbox', { name: 'Keywords' }),
        keywords,
      );
    },
  };
}
