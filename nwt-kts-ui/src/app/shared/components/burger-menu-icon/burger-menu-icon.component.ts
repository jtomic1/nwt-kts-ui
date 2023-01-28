import { Component, ViewChild } from '@angular/core';
import { DrawerService } from '../../services/drawer-service/drawer.service';

@Component({
  selector: 'app-burger-menu-icon',
  templateUrl: './burger-menu-icon.component.html',
  styleUrls: ['./burger-menu-icon.component.css'],
})
export class BurgerMenuIconComponent  {
  @ViewChild('burgerButton') button!: HTMLButtonElement;

  constructor(public drawerService: DrawerService) {}

  

  toggleIcon() {
    this.drawerService.toggleOpened();
  }

  get isOpened() {
    return this.drawerService.opened;
  }
}
