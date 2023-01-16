import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { LoginService } from 'src/app/features/startpage/services/login-service/login.service';
import { Ride } from 'src/app/shared/models/Ride';
import { MessageService, MessageType } from 'src/app/shared/services/message-service/message.service';
import { DriverRideService } from '../../../services/ride-service/driver-ride.service';

@Component({
  selector: 'app-new-ride-driver-dialog',
  templateUrl: './new-ride-driver-dialog.component.html',
  styleUrls: ['./new-ride-driver-dialog.component.css']
})
export class NewRideDriverDialogComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();
  
  constructor(@Inject(MAT_DIALOG_DATA) public data:{ride: Ride},
    private loginService: LoginService,
    private driverRideService: DriverRideService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
  }

  acceptRide():void {
    this.data.ride.driverId = this.loginService.user!.id;
    this.driverRideService.acceptRide(this.data.ride)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next:(res)=>{
            this.messageService.showMessage(
              "Uspešno ste prihvatili vožnju. Sad vozi.",
              MessageType.SUCCESS
            )
        },
        error: (err)=>{
            this.messageService.showMessage(err,MessageType.ERROR);
        }
      });
  }
}
