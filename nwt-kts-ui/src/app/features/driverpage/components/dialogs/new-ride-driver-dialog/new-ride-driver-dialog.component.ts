import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { LoginService } from 'src/app/features/startpage/services/login-service/login.service';
import { Ride } from 'src/app/shared/models/Ride';
import { MessageService, MessageType } from 'src/app/shared/services/message-service/message.service';
import { DriverRideService } from '../../../services/ride-service/driver-ride.service';
import { InRideDriverDialogComponent } from '../in-ride-driver-dialog/in-ride-driver-dialog.component';

@Component({
  selector: 'app-new-ride-driver-dialog',
  templateUrl: './new-ride-driver-dialog.component.html',
  styleUrls: ['./new-ride-driver-dialog.component.css']
})
export class NewRideDriverDialogComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();

  
  constructor(
    private dialogRef: MatDialogRef<NewRideDriverDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:{ride: Ride},
    private loginService: LoginService,
    private driverRideService: DriverRideService,
    private messageService: MessageService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  acceptRide():void {
    this.data.ride.driverId = this.loginService.user!.id;
    this.driverRideService.acceptRide(this.data.ride)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next:(res:any)=>{
            this.messageService.showMessage(
              "Uspešno ste prihvatili vožnju. Sad vozi.",
              MessageType.SUCCESS
            );
            console.log(res);
            this.data.ride.vehiclePlateNumber = res;
            this.dialog.open(InRideDriverDialogComponent,{
              data:{ride:this.data.ride}
            });
        },
        error: (err)=>{
            this.messageService.showMessage(err,MessageType.ERROR);
        }
      });
  }

  deniedRide( ){
    //TODO: da mu iskoci prozor za unos razloga odbijanja
    let driverId = this.loginService.user!.id;
    this.driverRideService.deniedRide(driverId,this.data.ride);
    this.dialogRef.close();
  }
}
