import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { Cart } from './cart';
import { Cookbook } from './cookbook';
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
  ],
  template: `
    <mat-form-field class="keywords" appearance="fill">
      <mat-label>Keywords</mat-label>
      <input [(ngModel)]="keywords" matInput />
    </mat-form-field>

    @if (cookbooks() !== undefined) {
      <section [class.loading]="isLoading()" class="cookbooks-container">
        @for (cookbook of cookbooks(); track cookbook.id) {
          <mc-cookbook-preview [cookbook]="cookbook">
            <button
              [disabled]="!cookbook.canAdd"
              (click)="addToCart(cookbook)"
              mat-stroked-button
              color="primary"
              data-slot="actions"
              target="_blank"
            >
              Add to Cart
            </button>
          </mc-cookbook-preview>
        } @empty {
          <div class="no-cookbooks-found" role="status" aria-live="polite">
            <img
              src="https://marmicode.io/assets/error.gif"
              alt="No cookbooks found"
            />
            <p>No cookbooks found</p>
          </div>
        }
      </section>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 10px;
    }

    .keywords {
      width: min(400px, 90vw);
    }

    .cookbooks-container {
      display: flex;
      flex-wrap: wrap;
      gap: 30px;
      justify-content: center;
      transition:
        filter 0.1s ease-in-out,
        opacity 0.1s ease-in-out;
    }

    .cookbooks-container.loading {
      filter: grayscale(1) blur(3px);
    }

    .no-cookbooks-found {
      font-family: Roboto, Helvetica, Arial, sans-serif;
      font-size: 2em;
      font-weight: 300;
      line-height: 1.2;
      text-align: center;
    }
  `,
})
export class CookbookSearch {
  protected keywords = signal<string | null>(null);

  private _cookbookRepository = inject(CookbookRepository);
  private _cookbooksResource = this._cookbookRepository.createCookbooksResource(
    this.keywords,
  );

  protected cookbooks = linkedSignal({
    source: () => ({
      isLoading: this._cookbooksResource.isLoading(),
      value: this._cookbooksResource.value(),
    }),
    computation: (source, previous): CookbookWithCartInfo[] | undefined => {
      /* Keep the previous value while the resource is loading. */
      if (source.isLoading) {
        return previous?.value;
      }

      return source.value?.map((cookbook) => ({
        ...cookbook,
        canAdd: this._cart.canAdd(cookbook.id),
      }));
    },
  }).asReadonly();

  protected isLoading = computed(() => this._cookbooksResource.isLoading());

  private _cart = inject(Cart);

  addToCart(cookbook: Cookbook) {
    this._cart.addCookbook(cookbook);
  }
}

interface CookbookWithCartInfo extends Cookbook {
  canAdd: boolean;
}

export default CookbookSearch;
