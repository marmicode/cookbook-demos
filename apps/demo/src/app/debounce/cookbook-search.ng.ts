import {
  ChangeDetectionStrategy,
  Component,
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

    .keywords {
      width: min(400px, 90vw);
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
  protected keywords = signal<string | null>(null);

  cookbooks = inject(CookbookRepository).createCookbooksResource(this.keywords);
}
