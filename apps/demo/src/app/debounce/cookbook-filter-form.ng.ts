import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mc-cookbook-filter-form',
  imports: [FormField, MatFormField, MatInput, MatLabel],
  template: `
    <mat-form-field class="keywords" appearance="fill">
      <mat-label>Keywords</mat-label>
      <input [formField]="filterForm.keywords" matInput />
    </mat-form-field>
  `,
  styles: `
    .keywords {
      width: min(400px, 90vw);
    }
  `,
})
export class CookbookFilterForm {
  filter = model<CookbookFilter>({ keywords: '' });

  filterForm = form(this.filter);
}

export interface CookbookFilter {
  keywords: string;
}
