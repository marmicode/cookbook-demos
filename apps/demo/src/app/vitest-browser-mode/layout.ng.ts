import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CookbookToolbar } from './cookbook-toolbar.ng';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mc-layout',
  imports: [CookbookToolbar, RouterOutlet],
  template: `
    <mc-cookbook-toolbar [cartItemCount]="cartItemCount()" />
    <router-outlet />
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
  `,
})
export class Layout {
  cartItemCount = computed(() => 42);
}

export default Layout;
