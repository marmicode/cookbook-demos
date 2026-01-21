import { Routes } from '@angular/router';
import { RecipeSelector } from './recipe-selector.ng';
import { CookbookSearch as VitestBrowserModeCookbookSearch } from './vitest-browser-mode/cookbook-search.ng';
import Layout from './vitest-browser-mode/layout.ng';

export const routes: Routes = [
  {
    path: '',
    component: RecipeSelector,
  },
  {
    path: 'vitest-browser-mode',
    component: Layout,
    children: [
      {
        path: '',
        component: VitestBrowserModeCookbookSearch,
      },
    ],
  },
];
