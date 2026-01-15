import { Routes } from '@angular/router';
import { RecipeSelector } from './recipe-selector.ng';
import FakeItCookbookSearch from './fake-it-till-you-mock-it/cookbook-search.ng';
import VitestBrowserModeCookbookSearch from './vitest-browser-mode/cookbook-search.ng';

export const routes: Routes = [
  {
    path: '',
    component: RecipeSelector,
  },
  {
    path: 'fake-it-till-you-mock-it',
    component: FakeItCookbookSearch,
  },
  {
    path: 'vitest-browser-mode',
    component: VitestBrowserModeCookbookSearch,
  },
];
