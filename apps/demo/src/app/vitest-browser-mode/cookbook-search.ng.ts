import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { CookbookPreview } from './cookbook-preview.ng';
import { CookbookRepository } from './cookbook-repository';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mc-cookbook-search',
  imports: [CookbookPreview, FormsModule, MatFormField, MatInput, MatLabel],
  template: `
    <mat-form-field class="keywords" appearance="fill">
      <mat-label>Keywords</mat-label>
      <input [(ngModel)]="keywords" matInput />
    </mat-form-field>

    <section class="cookbooks-container">
      @for (cookbook of cookbooks(); track cookbook.id) {
        <mc-cookbook-preview [cookbook]="cookbook" />
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
  cookbooks = computed(() =>
    this._cookbookRepository.searchCookbooks(this.keywords()),
  );
  protected keywords = signal<string | null>(null);

  private _cookbookRepository = inject(CookbookRepository);
}
