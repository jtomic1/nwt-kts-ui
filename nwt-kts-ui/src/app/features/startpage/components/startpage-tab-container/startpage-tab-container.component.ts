import { Component } from '@angular/core';

@Component({
  selector: 'app-startpage-tab-container',
  templateUrl: './startpage-tab-container.component.html',
  styleUrls: ['./startpage-tab-container.component.css'],
})
export class StartpageTabContainerComponent  {
  selectedIndex: number = 0;

  constructor() {}

  

  switchActiveTab(registrationEvent: boolean) {
    if (registrationEvent) this.selectedIndex = 0;
  }
}
