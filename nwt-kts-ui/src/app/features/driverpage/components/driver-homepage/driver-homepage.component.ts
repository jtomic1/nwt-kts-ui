import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/features/startpage/services/login-service/login.service';
import { DriverStatus } from 'src/app/shared/models/enums/DriverStatus';
import { NewRideDriverRequest } from 'src/app/shared/models/NewRideDriverRequest';
import { ReservationNotification } from 'src/app/shared/models/ReservationNotification';
import { Ride } from 'src/app/shared/models/Ride';
import { DriverService } from 'src/app/shared/services/driver-service/driver.service';
import { MessageService, MessageType } from 'src/app/shared/services/message-service/message.service';
import { TokensService } from 'src/app/shared/services/tokens-service/tokens.service';
import { environment } from 'src/environments/environment';
import { DriverRideService } from '../../services/ride-service/driver-ride.service';
import { InRideDriverDialogComponent } from '../dialogs/in-ride-driver-dialog/in-ride-driver-dialog.component';
import { NewRideDriverDialogComponent } from '../dialogs/new-ride-driver-dialog/new-ride-driver-dialog.component';

const io = require('socket.io-client');

@Component({
  selector: 'app-driver-homepage',
  templateUrl: './driver-homepage.component.html',
  styleUrls: ['./driver-homepage.component.css']
})
export class DriverHomepageComponent implements OnInit {

  socket:any;
  
  dialogRefNewRideRequest!: MatDialogRef<NewRideDriverDialogComponent>;

  constructor(
    public dialog1:MatDialog,
    public dialog2:MatDialog,
    private loginService:LoginService,
    private messageService:MessageService,
    private tokensService:TokensService,
    private driverRideService:DriverRideService,
    private driverService:DriverService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.setupSocketConnection();
    // this.loginService.userChanged.subscribe(
    //   (user)=>{
    //     if(user != null ){
    //       this.checkDriverStatus(user.id);
    //     }
    //   }
    // );
    this.checkDriverStatus(this.loginService.user!.id);
  }
  checkDriverStatus(driverId:number){
    this.driverService.getDriverStatus(driverId).subscribe({
      next:(res) =>{
        console.log(res);
        if(res == DriverStatus.DRIVING){
          this.startCurrentRideDialog();
        }
      }
    });
  }

  setupSocketConnection() {
    this.socket = io(environment.chatSocketEndpoint);
    
    this.socket.emit('join', this.loginService.user?.id);
    this.socket.on('newRideRequest', (data: NewRideDriverRequest) => {
      // console.log(data); 
      this.dialogRefNewRideRequest = this.dialog1.open(NewRideDriverDialogComponent,
        {
          data:{ ride: data.ride },
          height:"80%",
          width:"60%"
        });
    });

    this.socket.on('clientAcceptedRide', (data:NewRideDriverRequest) =>{
      if(this.dialogRefNewRideRequest)
        this.dialogRefNewRideRequest.close();
      if( data.ride.reservation ){
        this.messageService.showMessage("Klijent je potvrdio rezervaciju.",MessageType.INFO);
      }
      else{
        this.messageService.showMessage("Klijent je potvrdio vožnju!", MessageType.SUCCESS);
      }
      this.tokensService.currentUserTokensChangedSubject.next('');
    });
    
    this.socket.on('clientDeniedRide', (data:NewRideDriverRequest) =>{
      if(this.dialogRefNewRideRequest)
        this.dialogRefNewRideRequest.close();
      this.messageService.showMessage("Klijent je odbacio vožnju!", MessageType.INFO);
    });

    this.socket.on('driver-start-driving', () =>{
      // this.startCurrentRideDialog();
      // this.checkDriverStatus(this.loginService.user!.id);
    
      window.location.reload();
    });

    this.socket.on("notification-reservation",(message:ReservationNotification)=>{
      this.messageService.showMessage(message.message,MessageType.INFO);
    });

    this.socket.on('logout-driver',()=>{
      this.loginService.logout();
      this.router.navigateByUrl('login');
    });
  }

  startCurrentRideDialog(){
    this.messageService.showMessage("Vožnja u toku", MessageType.INFO);
    this.driverRideService.getDriverActiveRide(this.loginService.user!.id)
    .subscribe({
      next: (ride:Ride)=>{
        this.dialog2.open(InRideDriverDialogComponent,{
          data:{ride: ride},
          width:"100%",
          height:"70vh"
        });
      },
      error: (err)=>{
        this.messageService.showMessage(err , MessageType.ERROR);
      }
    });
  }
}
