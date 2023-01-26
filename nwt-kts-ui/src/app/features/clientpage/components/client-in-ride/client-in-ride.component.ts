import { Component, Input, OnInit } from '@angular/core';
import { NoteType } from 'src/app/shared/models/enums/NoteType';
import { Ride } from 'src/app/shared/models/Ride';

@Component({
  selector: 'app-client-in-ride',
  templateUrl: './client-in-ride.component.html',
  styleUrls: ['./client-in-ride.component.css']
})
export class ClientInRideComponent implements OnInit {

  @Input() ride!: Ride; 
  
  offenderId: number = -1;
  noteType :NoteType =  NoteType.CANCEL_FARE;
  opendComplaintDialog : boolean = false;
  titleReason: string = "Razlog žalbe na vožnju";
  
  constructor() { }

  ngOnInit(): void {
  }

  openComplaintDialog(){
    this.offenderId = this.ride.driverId!;
    this.opendComplaintDialog = true;
    
  }
  
  closeDialog(noteSent:boolean){
    if(noteSent)
      this.opendComplaintDialog = false;
    else{
      this.titleReason = "Nismo uspeli da sačuvamo žalbu, probajte ponovo."
    }
  }
}
