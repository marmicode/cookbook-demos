import { Injectable, signal } from '@angular/core';
import { Cookbook } from './cookbook';

@Injectable({ providedIn: 'root' })
export class Cart {
  private _cookbooks = signal<Cookbook[]>([]);

  cookbooks = this._cookbooks.asReadonly();

  addCookbook(cookbook: Cookbook): void {
    if (!this.canAdd(cookbook.id)) {
      throw new Error(`Cookbook ${cookbook.id} can't be added.`);
    }
    this._cookbooks.update((cookbooks) => [...cookbooks, cookbook]);
  }

  removeCookbook(cookbookId: string): void {
    this._cookbooks.update((cb) => cb.filter((item) => item.id !== cookbookId));
  }

  canAdd(cookbookId: string): boolean {
    return !this._cookbooks().some((item) => item.id === cookbookId);
  }
}
