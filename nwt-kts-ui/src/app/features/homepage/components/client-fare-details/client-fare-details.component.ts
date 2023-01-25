import { Component, Input, OnInit } from '@angular/core';
import { FareDTO } from '../../models/FareDTO';

@Component({
  selector: 'app-client-fare-details',
  templateUrl: './client-fare-details.component.html',
  styleUrls: ['./client-fare-details.component.css'],
})
export class ClientFareDetailsComponent implements OnInit {
  @Input() fareData!: FareDTO;

  constructor() {}

  ngOnInit(): void {
    console.log(this.fareData);
  }
}
