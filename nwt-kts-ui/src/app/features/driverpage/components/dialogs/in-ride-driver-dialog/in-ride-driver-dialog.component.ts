import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Ride } from 'src/app/shared/models/Ride';
import { DriverRideService } from '../../../services/ride-service/driver-ride.service';

@Component({
  selector: 'app-in-ride-driver-dialog',
  templateUrl: './in-ride-driver-dialog.component.html',
  styleUrls: ['./in-ride-driver-dialog.component.css']
})
export class InRideDriverDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data:{ride: Ride},
    private driverRideService: DriverRideService  
  ) { }

  ngOnInit(): void {
  }

  finishRide(){
    this.driverRideService.stopRideDriveSimulation(this.data.ride.vehiclePlateNumber!,this.data.ride);
  }

  interruptRide(){
    this.driverRideService.stopRideDriveSimulation(this.data.ride.vehiclePlateNumber!,this.data.ride);
    
  }
}
