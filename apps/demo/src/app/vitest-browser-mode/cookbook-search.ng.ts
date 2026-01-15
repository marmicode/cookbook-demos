import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatToolbar } from '@angular/material/toolbar';
import { CookbookPreview } from './cookbook-preview.ng';
import { CookbookRepository } from './cookbook-repository';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mc-cookbook-search',
  imports: [
    CookbookPreview,
    FormsModule,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatToolbar,
    MatIconButton,
    MatIcon,
  ],
  template: `
    <mat-toolbar color="primary">
      <span class="spacer"></span>
      <button mat-icon-button class="cart-button">
        <mat-icon>shopping_cart</mat-icon>
        <span class="cart-badge">{{ cartItemCount() }}</span>
      </button>
    </mat-toolbar>

    <mat-form-field class="keywords" appearance="fill">
      <mat-label>Keywords</mat-label>
      <input [(ngModel)]="keywords" matInput />
    </mat-form-field>

    <section class="cookbooks-container">
      @for (cookbook of cookbooks(); track cookbook.id) {
        <mc-cookbook-preview [cookbook]="cookbook">
          <button
            mat-stroked-button
            color="primary"
            data-slot="actions"
            target="_blank"
          >
            Add to Cart
          </button>
        </mc-cookbook-preview>
      } @empty {
        <p>No cookbooks found</p>
      }
    </section>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

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

    .keywords {
      width: min(400px, 90vw);
    }

    .cookbooks-container {
      display: flex;
      flex-wrap: wrap;
      gap: 30px;
      justify-content: center;
    }
  `,
})
export class CookbookSearch {
  cartItemCount = computed(() => 42);
  cookbooks = computed(() =>
    this._cookbookRepository.searchCookbooks(this.keywords()),
  );
  protected keywords = signal<string | null>(null);

  private _cookbookRepository = inject(CookbookRepository);
}

export default CookbookSearch;
