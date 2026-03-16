import { Routes } from '@angular/router';
import { RecipeSelector } from './recipe-selector.ng';
import { recipeRouterHelper } from './recipe.router-helper';

export const routes: Routes = [
  {
    path: '',
    component: RecipeSelector,
  },
  {
    path: recipeRouterHelper.FAKE_IT_TILL_YOU_MOCK_IT,
    loadComponent: () => import('./fake-it-till-you-mock-it'),
  },
  {
    path: recipeRouterHelper.VITEST_BROWSER_MODE,
    loadComponent: () => import('./vitest-browser-mode'),
  },
];
