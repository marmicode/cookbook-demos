import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { of } from 'rxjs';
import { CookbookPreview } from './cookbook-preview.ng';
import { CookbookRepository } from './cookbook-repository';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mc-cookbook-search',
  imports: [
    CookbookPreview,
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatProgressSpinner,
  ],
  template: `
    <mat-form-field appearance="fill">
      <mat-label>Keywords</mat-label>
      <input [(ngModel)]="keywords" matInput />
    </mat-form-field>

    @if (cookbooksResource.hasValue()) {
      <section class="cookbooks-container">
        @for (cookbook of cookbooksResource.value(); track cookbook.id) {
          <mc-cookbook-preview [cookbook]="cookbook" />
        } @empty {
          <p>No cookbooks found</p>
        }
      </section>
    }

    @if (cookbooksResource.isLoading()) {
      <mat-spinner />
    }

    @if (cookbooksResource.error()) {
      <p role="alert">🙀 Oh no! Something went wrong.</p>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
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
  cookbooksResource = rxResource({
    params: () => ({ keywords: this.keywords() }),
    stream: ({ params: { keywords } }) => {
      return this._cookbookRepository.searchCookbooks(keywords ?? null);
    },
  });

  protected keywords = signal<string | undefined>(undefined);

  private _cookbookRepository = inject(CookbookRepository);
}
