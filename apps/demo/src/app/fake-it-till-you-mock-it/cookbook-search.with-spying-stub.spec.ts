import { TestBed } from '@angular/core/testing';
import { screen } from '@testing-library/dom';
import { userEvent } from '@testing-library/user-event';
import { of } from 'rxjs';
import { describe, expect, it, Mocked, vi } from 'vitest';
import { CookbookRepository } from './cookbook-repository';
import { CookbookSearch } from './cookbook-search.ng';
import { cookbookMother } from './core/cookbook.mother';
import { Public } from './core/public';

/**
 * ⚠️ This is the approach that should be avoided.
 * Prefer using fakes instead.
 * See {@link ./cookbook-search.spec.ts} for the preferred approach.
 */
describe(CookbookSearch.name, () => {
  it('should display the returned cookbooks', async () => {
    await renderCookbookSearch();

    const els = await screen.findAllByRole('heading');
    expect(els).toHaveLength(2);
    expect(els[0]).toHaveTextContent('Ottolenghi Simple');
    expect(els[1]).toHaveTextContent('Burgers 101');
  });

  it('should call repository with the right keywords', async () => {
    const { repo } = await renderCookbookSearch();

    await userEvent.type(
      await screen.findByRole('textbox', { name: 'Keywords' }),
      'Ottolenghi',
    );

    expect(repo.searchCookbooks).toHaveBeenLastCalledWith('Ottolenghi');
  });
});

async function renderCookbookSearch() {
  /**
   * ⚠️ Avoid using Spying Stubs like this.
   * Prefer using fakes instead.
   * See {@link ./cookbook-search.spec.ts} for the preferred approach.
   */
  const repo: Mocked<Public<CookbookRepository>> = {
    searchCookbooks: vi.fn(),
  };

  const ottolenghiSimple = cookbookMother
    .withBasicInfo('Ottolenghi Simple')
    .withAuthor('Ottolenghi')
    .build();
  const burgers101 = cookbookMother.withBasicInfo('Burgers 101').build();

  repo.searchCookbooks.mockReturnValue(of([ottolenghiSimple, burgers101]));

  TestBed.configureTestingModule({
    providers: [
      {
        provide: CookbookRepository,
        useValue: repo,
      },
    ],
  });

  TestBed.createComponent(CookbookSearch);

  return {
    repo,
  };
}
