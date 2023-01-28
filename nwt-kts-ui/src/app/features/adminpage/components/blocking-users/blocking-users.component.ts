import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blocking-users',
  templateUrl: './blocking-users.component.html',
  styleUrls: ['./blocking-users.component.css']
})
export class BlockingUsersComponent{

  clients: string = 'clients';
  drivers: string = 'drivers';

  constructor() { }

}
