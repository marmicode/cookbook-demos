import {
  Component,
  Directive,
  inject,
  signal,
  Signal,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  @for(recipe of recipes(); track recipe.id) {
    <article>{{ recipe.name }}</article>
  } @empty {
    <p>No recipes found</p>
  }
  `,
})
export class App {
  recipes: Signal<Recipe[]> = signal([
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
