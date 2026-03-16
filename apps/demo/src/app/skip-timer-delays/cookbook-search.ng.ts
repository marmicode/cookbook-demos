import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CookbookFilter, CookbookFilterForm } from './cookbook-filter-form.ng';
import { CookbookPreview } from './cookbook-preview.ng';
import { CookbookRepository } from './cookbook-repository';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mc-cookbook-search',
  imports: [CookbookFilterForm, CookbookPreview],
  template: `
    <mc-cookbook-filter-form (filterChange)="filter.set($event)" />

    @if (cookbooks.error()) {
      <div class="status" role="status" aria-live="polite">
        <img
          src="https://marmicode.io/assets/error.gif"
          alt="Marmicode cooking pot is sad"
        />
        <p>Something went wrong</p>
      </div>
    } @else {
      <section class="cookbooks-container">
        @for (cookbook of cookbooks.value(); track cookbook.id) {
          <mc-cookbook-preview [cookbook]="cookbook" />
        } @empty {
          <div class="status" role="status" aria-live="polite">
            <img
              src="https://marmicode.io/assets/error.gif"
              alt="Marmicode cooking pot is sad"
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

    .cookbooks-container {
      display: flex;
      flex-wrap: wrap;
      gap: 30px;
      justify-content: center;
    }

    .status {
      font-family: Roboto, Helvetica, Arial, sans-serif;
      font-size: 2em;
      font-weight: 300;
      line-height: 1.2;
      text-align: center;
    }
  `,
})
export class CookbookSearch {
  filter = signal<CookbookFilter | null>(null);
  keywords = computed(() => this.filter()?.keywords ?? null);
  cookbooks = inject(CookbookRepository).createCookbooksResource(this.keywords);
}
