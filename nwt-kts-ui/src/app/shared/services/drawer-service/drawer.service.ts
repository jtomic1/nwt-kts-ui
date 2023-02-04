import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DrawerService {
  public opened: boolean = false;
  constructor() {}

  toggleOpened(): void {
    this.opened = !this.opened;
  }
}
