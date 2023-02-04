import { Component, Input } from '@angular/core';
import { FareDTO } from 'src/app/features/homepage/models/FareDTO';
import { UserDTO } from '../../models/UserDTO';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css'],
})
export class ProfileDetailsComponent  {
  @Input() fareData!: FareDTO;
  @Input() mode: 'driver' | 'client' = 'driver';
  @Input() clientIndex: number = 0;

  constructor() {}

  

  get client(): UserDTO {
    return this.fareData.users[this.clientIndex];
  }
}
