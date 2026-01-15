import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatAnchor } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardHeader,
  MatCardImage,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { Cookbook } from './core/cookbook';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mc-cookbook-preview',
  imports: [
    MatCard,
    MatCardActions,
    MatCardHeader,
    MatCardImage,
    MatCardSubtitle,
    MatCardTitle,
    MatAnchor,
  ],
  template: `
    <mat-card class="card">
      <mat-card-header class="header">
        <mat-card-title class="title" role="heading">{{
          cookbook().title
        }}</mat-card-title>
        <mat-card-subtitle
          >{{ cookbook().authors.join(', ') }}
        </mat-card-subtitle>
      </mat-card-header>

      @if (cookbook().pictureUri; as pictureUri) {
        <img [src]="pictureUri" mat-card-image alt="{{ cookbook().title }}" />
      }

      <mat-card-actions class="actions">
        @if (cookbook().previewUrl; as previewUrl) {
          <a
            [href]="previewUrl"
            mat-stroked-button
            color="primary"
            target="_blank"
            >Preview</a
          >
        }
      </mat-card-actions>
    </mat-card>
  `,
  styles: `
    :host {
      display: block;
      width: 300px;
    }

    .card {
      height: 100%;
      flex-direction: column;
      justify-content: space-between;
    }

    .header {
      display: block;
    }

    .title {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 100%;
    }

    img {
      max-height: 200px;
      object-fit: cover;
    }

    .actions {
      display: flex;
      justify-content: center;
    }
  `,
})
export class CookbookPreview {
  cookbook = input.required<Cookbook>();
}
