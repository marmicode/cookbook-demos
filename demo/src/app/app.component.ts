import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-recipe-list',
  template: `
    @for (recipe of recipes(); track recipe.id) {
      <article>{{ recipe.name }}</article>
    } @empty {
      <p>No recipes found</p>
    }
  `,
})
export class RecipeList {
  recipes = input.required<Recipe[]>();
}

@Component({
  selector: 'app-root',
  imports: [RecipeList],
  template: `<app-recipe-list [recipes]="recipes()" />`,
})
export class App {
  recipes = signal<Recipe[]>([
    { id: 'rec_burger', name: 'Burger' },
    { id: 'rec_babaganoush', name: 'Babaganoush' },
  ]);
}

interface Recipe {
  id: string;
  name: string;
}
