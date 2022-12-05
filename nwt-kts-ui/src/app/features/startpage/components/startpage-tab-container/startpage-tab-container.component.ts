import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-startpage-tab-container',
  templateUrl: './startpage-tab-container.component.html',
  styleUrls: ['./startpage-tab-container.component.css'],
})
export class StartpageTabContainerComponent implements OnInit {
  selectedIndex: number = 0;

  constructor() {}

  ngOnInit(): void {}

  switchActiveTab(registrationEvent: boolean) {
    if (registrationEvent) this.selectedIndex = 0;
  }
}
