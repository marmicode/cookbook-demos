import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardHeader,
  MatCardImage,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { Cookbook } from './cookbook';

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
  ],
  template: `
    <mat-card class="card" role="article">
      <a [href]="cookbook().previewUrl" target="_blank" class="card-link">
        <mat-card-header class="header">
          <mat-card-title class="title" role="heading">{{
            cookbook().title
          }}</mat-card-title>
          <mat-card-subtitle
            >{{ cookbook().authors.join(', ') }}
          </mat-card-subtitle>
        </mat-card-header>

        @if (cookbook().pictureUri; as pictureUri) {
          <img
            [alt]="cookbook().title"
            [src]="pictureUri"
            class="picture"
            mat-card-image
          />
        }
      </a>
      <mat-card-actions class="actions">
        <ng-content select="[data-slot='actions']" />
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
    }

    .card-link {
      text-decoration: none;
      color: inherit;
      display: block;
      flex: 1;
      cursor: pointer;
    }

    .card-link:hover {
      text-decoration: none;
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

    .picture {
      max-height: 200px;
      width: 100%;
      object-fit: contain;
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
