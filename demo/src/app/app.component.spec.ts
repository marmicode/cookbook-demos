import { render, screen } from '@testing-library/angular';
import { App } from './app.component';

describe(App.name, () => {
  it('should show recipes', async () => {
    await render(App);

    const recipeNames = (await screen.findAllByRole('article')).map(
      (el) => el.textContent,
    );

    expect(recipeNames).toEqual(['Burger', 'Babaganoush']);
  });
});
