import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mc-cookbook-toolbar',
  imports: [MatToolbar, MatIconButton, MatIcon],
  template: `
    <mat-toolbar color="primary">
      <span class="spacer"></span>
      <button mat-icon-button class="cart-button">
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
      height: 18px;
      font-size: 11px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 5px;
      background-color: #f44336;
      color: white;
      border-radius: 9px;
      line-height: 1;
      z-index: 1;
    }
  `,
})
export class CookbookToolbar {
  cartItemCount = input.required<number>();
}

export default CookbookToolbar;
