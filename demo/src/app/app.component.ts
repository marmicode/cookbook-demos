import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    @for (recipe of recipes(); track recipe.id) {
      <article>{{ recipe.name }}</article>
    } @empty {
      <p>No recipes found</p>
    }
  `,
})
export class App {
  recipes = signal<Recipe[]>([
    {
      id: 'rec_burger',
      name: 'Burger',
    },
    {
      id: 'rec_babaganoush',
      name: 'Babaganoush',
    },
  ]);
}

interface Recipe {
  id: string;
  name: string;
}
