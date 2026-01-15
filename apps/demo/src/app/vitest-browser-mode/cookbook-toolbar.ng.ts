import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { Cart } from './cart';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mc-cookbook-toolbar',
  imports: [MatToolbar, MatIconButton, MatIcon],
  template: `
    <mat-toolbar color="primary">
      <span class="spacer"></span>
      <button mat-icon-button>
        <mat-icon>shopping_cart</mat-icon>
        <span class="cart-badge">{{ cartItemCount() }}</span>
      </button>
    </mat-toolbar>
  `,
  styles: `
    .spacer {
      flex: 1 1 auto;
    }

    .cart-badge {
      position: absolute;
      top: 0;
      right: 0;

      font-size: 11px;
      font-weight: 600;

      line-height: 18px;
      text-align: center;
      vertical-align: middle;
      padding: 0 5px;
      background-color: #f44336;
      border-radius: 9px;
    }
  `,
})
export class CookbookToolbar {
  protected cartItemCount = computed(() => this._cart.cookbooks().length);

  private _cart = inject(Cart);
}

export default CookbookToolbar;
