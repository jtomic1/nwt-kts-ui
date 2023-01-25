import { Component, Input, OnInit } from '@angular/core';
import { FareDTO } from 'src/app/features/homepage/models/FareDTO';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css'],
})
export class ProfileDetailsComponent implements OnInit {
  @Input() fareData!: FareDTO;

  constructor() {}

  ngOnInit(): void {}
}
