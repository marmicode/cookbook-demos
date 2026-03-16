import { Injectable, resource, Resource, Signal } from '@angular/core';
import { Cookbook, createCookbook } from './cookbook';

@Injectable({ providedIn: 'root' })
export class CookbookRepository {
  private _cookbooks: Cookbook[] = [
    createCookbook({
      id: 'angular-testing-cookbook',
      title: 'Angular Testing Cookbook',
      authors: ['Younes Jaaidi | Marmicode'],
      description:
        "This cookbook is the complementary resource to the Pragmatic Angular Testing course. It's for Angular developers who want to build a pragmatic testing strategy — in opposition to dogmatic approaches.",
      pictureUri: 'https://cookbook.marmicode.io/img/social-card.png',
      previewUrl: 'https://cookbook.marmicode.io/angular/testing',
    }),
    createCookbook({
      id: 'simple',
      title: 'Simple',
      authors: ['Yotam Ottolenghi'],
      description:
        'This cookbook offers straightforward recipes with bold flavors, such as Couscous, Cherry Tomato & Herb Salad, and Shakshuka.',
      pictureUri: 'https://ottolenghi.co.uk/cdn/shop/files/Simple_book.jpg',
      previewUrl: 'https://www.ottolenghi.co.uk/simple',
    }),
    createCookbook({
      id: 'angular-core-cookbook',
      title: 'Angular Core Cookbook',
      authors: ['Younes Jaaidi | Marmicode'],
      description:
        'This Angular Core cookbook distills the essential knowledge for building apps that scale and survive Angular migrations. It cuts through the noise — no experimental APIs, no hype. Just the knowledge that matters.',
      pictureUri: 'https://cookbook.marmicode.io/img/social-card.png',
      previewUrl: 'https://cookbook.marmicode.io/angular',
    }),
    createCookbook({
      id: 'all-the-cuisine-of-paul-bocuse',
      title: 'All the Cuisine of Paul Bocuse',
      authors: ['Paul Bocuse'],
      description:
        'A comprehensive collection of 500 traditional French recipes, emphasizing fresh and widely available ingredients.',
      pictureUri:
        'https://books.google.com/books/content?id=srd7EAAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
      previewUrl:
        'https://www.google.com/books/edition/Toute_la_cuisine_de_Paul_Bocuse/srd7EAAAQBAJ?hl=en&gbpv=0',
    }),
    createCookbook({
      id: 'plenty',
      title: 'Plenty',
      authors: ['Yotam Ottolenghi'],
      description:
        'A collection of vegetarian recipes showcasing innovative approaches to vegetables, including dishes like Black Pepper Tofu and Caramelized Garlic Tart.',
      pictureUri: 'https://ottolenghi.co.uk/cdn/shop/files/Plenty_book.jpg',
      previewUrl: 'https://www.ottolenghi.co.uk/plenty',
    }),
    createCookbook({
      id: 'nx-cookbook',
      title: 'Nx Cookbook',
      authors: ['Younes Jaaidi | Marmicode'],
      description:
        'Nx is a Progressive Build Companion. This cookbook helps you make the right choice based on your context, from small to enterprise scale, focusing on business and features instead of tooling.',
      pictureUri: 'https://cookbook.marmicode.io/img/social-card.png',
      previewUrl: 'https://cookbook.marmicode.io/nx',
    }),
    createCookbook({
      id: 'sweet',
      title: 'Sweet',
      authors: ['Helen Goh', 'Yotam Ottolenghi'],
      description:
        'Co-authored with Helen Goh, this book focuses on desserts, featuring recipes like Meringue Roulade with Rose and Berries.',
      pictureUri: 'https://ottolenghi.co.uk/cdn/shop/files/Sweet_book.jpg',
      previewUrl: 'https://www.ottolenghi.co.uk/sweet',
    }),
    createCookbook({
      id: 'bocuse-in-your-kitchen',
      title: 'Paul Bocuse in Your Kitchen',
      authors: ['Paul Bocuse'],
      description:
        'Features 220 simple, classic French recipes designed for home cooks, with step-by-step instructions and illustrative photos.',
      pictureUri:
        'https://books.google.com/books/content?id=FPwIAQAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
      previewUrl:
        'https://www.google.fr/books/edition/Paul_Bocuse_in_Your_Kitchen/FPwIAQAAMAAJ?hl=en',
    }),
  ];

  createCookbooksResource(
    keywords: Signal<string | null>,
  ): Resource<Cookbook[] | undefined> {
    return resource({
      params: () => ({ keywords: keywords() }),
      loader: async ({ params: { keywords } }) => {
        let cookbooks = this._cookbooks;

        if (keywords) {
          cookbooks = this._cookbooks.filter(
            (cookbook) =>
              this._valueIncludes(cookbook.title, keywords) ||
              cookbook.authors.some((author) =>
                this._valueIncludes(author, keywords),
              ),
          );
        }

        return cookbooks;
      },
    });
  }

  private _valueIncludes(value: string, keywords: string): boolean {
    return value.toLowerCase().includes(keywords.toLowerCase());
  }
}
