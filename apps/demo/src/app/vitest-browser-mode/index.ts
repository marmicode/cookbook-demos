import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CookbookToolbar } from './cookbook-toolbar.ng';
import { CookbookSearch } from './cookbook-search.ng';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mc-layout',
  imports: [CookbookToolbar, CookbookSearch],
  template: `
    <mc-cookbook-toolbar />
    <mc-cookbook-search />
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
  `,
})
export default class Index {}
