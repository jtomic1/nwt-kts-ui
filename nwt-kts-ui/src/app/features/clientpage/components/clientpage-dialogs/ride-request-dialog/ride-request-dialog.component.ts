import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Ride } from 'src/app/shared/models/Ride';

@Component({
  selector: 'app-ride-request-dialog',
  templateUrl: './ride-request-dialog.component.html',
  styleUrls: ['./ride-request-dialog.component.css']
})
export class RideRequestDialogComponent implements OnInit {

  processIsFinished: boolean = false;
  cantFindRide: boolean = false;
  ride!: Ride;
  message:string="";
  title:string="";
  constructor(private matDialogRef: MatDialogRef<RideRequestDialogComponent>,
    ) { }

  ngOnInit(): void {
    this.matDialogRef.disableClose = true;
  }

  setMessage( newMessage : string){
    this.message = newMessage;
  }

  setTitle( newTitle: string){
    this.title = newTitle;
  }

  finishProcess(ride:Ride){
    this.processIsFinished = true;
    this.ride = ride;
  }

  cancelRide(){
    this.matDialogRef.close("NOTHING");
  }

  acceptRide(){
    this.matDialogRef.close("ACCEPTED");
  }

  setCantFindRide(){
    this.cantFindRide = true;
  }
  resetCantFindRide(){
    this.cantFindRide = false;
  }

}
