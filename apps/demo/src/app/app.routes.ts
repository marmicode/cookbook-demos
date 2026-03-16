import { Routes } from '@angular/router';
import { RecipeSelector } from './recipe-selector.ng';

export const routes: Routes = [
  {
    path: '',
    component: RecipeSelector,
  },
  {
    path: 'fake-it-till-you-mock-it',
    loadComponent: () => import('./fake-it-till-you-mock-it'),
  },
  {
    path: 'vitest-browser-mode',
    loadComponent: () => import('./vitest-browser-mode'),
  },
];
