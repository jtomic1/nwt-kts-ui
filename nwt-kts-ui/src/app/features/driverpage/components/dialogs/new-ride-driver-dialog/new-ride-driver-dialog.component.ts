import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { LoginService } from 'src/app/features/startpage/services/login-service/login.service';
import { NoteType } from 'src/app/shared/models/enums/NoteType';
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
  driverId: number = -1;
  noteType :NoteType =  NoteType.CANCEL_FARE;
  openDeniedDialog : boolean = false;
  titleReason: string = "Razlog odbijanja";
 
  acceptedRide : boolean = false;
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
              "Uspešno ste prihvatili vožnju",
              MessageType.SUCCESS
            );
            this.data.ride.vehiclePlateNumber = res;
            this.acceptedRide = true;
        },
        error: (err)=>{
            this.messageService.showMessage(err,MessageType.ERROR);
        }
      });
  }

  deniedRide( ){

    //TODO: da mu iskoci prozor za unos razloga odbijanja
    this.openDeniedDialog = true;

    this.driverId = this.loginService.user!.id;
    this.driverRideService.deniedRide(this.driverId,this.data.ride);
  }

  closeDialog(noteSent:boolean){
    if(noteSent)
      this.dialogRef.close();
    else{
      this.titleReason = "Nismo uspeli da sacuvamo razlog, probajte ponovo."
    }
  }
}
