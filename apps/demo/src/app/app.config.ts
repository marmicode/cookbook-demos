import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { IMAGE_CONFIG } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    /* For convenience, we are using oversized online images in the demo
     * instead of downloading them and resizing them. */
    { provide: IMAGE_CONFIG, useValue: { disableImageSizeWarning: true } },
  ],
};
