import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginService } from 'src/app/features/startpage/services/login-service/login.service';
import { NoteType } from 'src/app/shared/models/enums/NoteType';
import { Ride } from 'src/app/shared/models/Ride';
import { MapService } from 'src/app/shared/services/map-service/map.service';
import { MessageService, MessageType } from 'src/app/shared/services/message-service/message.service';
import { DriverRideService } from '../../../services/ride-service/driver-ride.service';

@Component({
  selector: 'app-in-ride-driver-dialog',
  templateUrl: './in-ride-driver-dialog.component.html',
  styleUrls: ['./in-ride-driver-dialog.component.css']
})
export class InRideDriverDialogComponent implements OnInit {
  driverId: number = -1;
  noteType :NoteType =  NoteType.CANCEL_FARE;
  openDeniedDialog : boolean = false;
  titleReason: string = "Razlog prekidanja vožnje";
  
  startCord!: L.LatLng;
  endCord! : L.LatLng;
  onWayStations : L.LatLng[] = [];


  constructor(
    @Inject(MAT_DIALOG_DATA) public data:{ride: Ride},
    private dialogRef: MatDialogRef<InRideDriverDialogComponent>,
    private driverRideService: DriverRideService ,
    private messageService: MessageService,
    private loginService: LoginService,
    private mapService:MapService
  ) { 
  }

  ngOnInit(): void {
    let cords: L.LatLng[] = this.mapService.getLatLngFromStopsString(this.data.ride.stops);
    this.setLatLng(cords);
  }

  finishRide(){
    this.driverRideService.stopRideDriveSimulation(this.data.ride.vehiclePlateNumber!,this.data.ride);
    this.driverRideService.finishRide(this.data.ride).subscribe({
      next:(res)=>{
        this.messageService.showMessage(res,MessageType.SUCCESS);
      },
      error:(err)=>{
        this.messageService.showMessage(err,MessageType.ERROR);
      }
    })
  }

  interruptRide(){
    this.driverRideService.stopRideDriveSimulation(this.data.ride.vehiclePlateNumber!,this.data.ride);
    this.driverRideService.finishRide(this.data.ride).subscribe({
      next:(res)=>{
        this.messageService.showMessage(res,MessageType.SUCCESS);
      },
      error:(err)=>{
        this.messageService.showMessage(err,MessageType.ERROR);
      }
    });
    this.driverId = this.loginService.user!.id;
    this.openDeniedDialog = true;
  }
  
  closeDialog(noteSent:boolean){
    if(noteSent)
      this.dialogRef.close();
    else{
      this.titleReason = "Nismo uspeli da sacuvamo razlog, probajte ponovo."
    }
  }
  
  setLatLng(cords:L.LatLng[]){
    let tempCord = cords.pop();
    this.endCord = tempCord!;
    tempCord = cords.pop();
    while( cords.length >= 1){
      let temp = tempCord!;
      this.onWayStations.push(temp);
      tempCord = cords.pop();
    }
    this.startCord = tempCord!;
  }
}
