import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Ride } from 'src/app/shared/models/Ride';
import { MessageService, MessageType } from 'src/app/shared/services/message-service/message.service';
import { DriverRideService } from '../../../services/ride-service/driver-ride.service';

@Component({
  selector: 'app-in-ride-driver-dialog',
  templateUrl: './in-ride-driver-dialog.component.html',
  styleUrls: ['./in-ride-driver-dialog.component.css']
})
export class InRideDriverDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data:{ride: Ride},
    private driverRideService: DriverRideService ,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
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
    //TODO: prikazati dialog za unos poruke administratorima
  }
}
