import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mc-recipe-selector',
  imports: [RouterLink, MatIcon],
  template: `
    <div class="container">
      <h1>Cookbook Recipes</h1>
      <nav>
        <ul>
          @for (recipe of recipes; track recipe.route) {
            <li>
              <div class="recipe-item">
                <a
                  [attr.aria-label]="'View demo: ' + recipe.title"
                  [routerLink]="recipe.route"
                  class="recipe-link"
                >
                  <span class="recipe-title">{{ recipe.title }}</span>
                  <span class="action-label">View Demo</span>
                </a>
                <div class="divider"></div>
                <a
                  [attr.aria-label]="'Open cookbook chapter: ' + recipe.title"
                  [href]="recipe.externalUrl"
                  (click)="$event.stopPropagation()"
                  class="external-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <mat-icon>open_in_new</mat-icon>
                  <span class="action-label">Read Chapter</span>
                </a>
              </div>
            </li>
          }
        </ul>
      </nav>
    </div>
  `,
  styles: `
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 3rem 2rem;
    }

    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: white;
      margin-bottom: 3rem;
      text-align: center;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    nav ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    nav li {
      background: white;
      border-radius: 12px;
      box-shadow:
        0 4px 6px rgba(0, 0, 0, 0.1),
        0 2px 4px rgba(0, 0, 0, 0.06);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
    }

    nav li:hover {
      transform: translateY(-2px);
      box-shadow:
        0 10px 15px rgba(0, 0, 0, 0.15),
        0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .recipe-item {
      display: flex;
      align-items: center;
      padding: 0.5rem 2rem;
      gap: 1rem;
    }

    .recipe-link {
      display: flex;
      align-items: center;
      flex: 1;
      text-decoration: none;
      color: inherit;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      transition: all 0.2s;
      gap: 0.75rem;
    }

    .recipe-link:hover {
      background-color: #f3f4f6;
    }

    .recipe-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1f2937;
      flex: 1;
      line-height: 1.5;
    }

    .action-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #6b7280;
      white-space: nowrap;
    }

    .recipe-link:hover .action-label {
      color: #667eea;
    }

    .divider {
      width: 1px;
      height: 2rem;
      background-color: #e5e7eb;
      flex-shrink: 0;
    }

    .external-link {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem 1rem;
      color: #6b7280;
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.2s;
      flex-shrink: 0;
      gap: 0.5rem;
    }

    .external-link:hover {
      background-color: #f3f4f6;
      color: #667eea;
    }

    .external-link mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .external-link .action-label {
      white-space: nowrap;
    }

    @media (max-width: 640px) {
      .container {
        padding: 2rem 1rem;
      }

      h1 {
        font-size: 2rem;
        margin-bottom: 2rem;
      }

      .recipe-item {
        padding: 1.25rem 1.5rem;
        flex-direction: column;
        align-items: stretch;
        gap: 0.75rem;
      }

      .recipe-link {
        width: 100%;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .recipe-title {
        font-size: 1.125rem;
      }

      .divider {
        width: 100%;
        height: 1px;
        margin: 0.5rem 0;
      }

      .external-link {
        width: 100%;
        justify-content: flex-start;
      }
    }
  `,
})
export class RecipeSelector {
  protected readonly recipes: CookbookRecipeInfo[] = [
    {
      title: 'How to Cook a Fake',
      route: '/fake-it-till-you-mock-it',
      externalUrl:
        'https://cookbook.marmicode.io/angular/testing/how-to-cook-a-fake',
    },
    {
      title: 'How to Progressively Migrate to Vitest Browser Mode',
      route: '/vitest-browser-mode',
      externalUrl:
        'https://cookbook.marmicode.io/angular/testing/how-to-migrate-to-vitest-browser-mode',
    },
  ];
}

interface CookbookRecipeInfo {
  title: string;
  route: string;
  externalUrl: string;
}
