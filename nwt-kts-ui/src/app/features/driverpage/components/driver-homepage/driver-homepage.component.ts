import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginService } from 'src/app/features/startpage/services/login-service/login.service';
import { NewRideDriverRequest } from 'src/app/shared/models/NewRideDriverRequest';
import { MessageService, MessageType } from 'src/app/shared/services/message-service/message.service';
import { TokensService } from 'src/app/shared/services/tokens-service/tokens.service';
import { environment } from 'src/environments/environment';
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

  constructor(public dialog:MatDialog,
    private loginService:LoginService,
    private messageService:MessageService,
    private tokensService:TokensService
  ) { }

  ngOnInit(): void {
    this.setupSocketConnection();
  }

  setupSocketConnection() {
    this.socket = io(environment.chatSocketEndpoint);
    
    this.socket.emit('join', this.loginService.user?.id);
    this.socket.on('newRideRequest', (data: NewRideDriverRequest) => {
      console.log(data); 
      this.dialogRefNewRideRequest= this.dialog.open(NewRideDriverDialogComponent,
        {
          data:{ ride: data.ride },
          height:"80%",
          width:"60%"
        })
    });

    this.socket.on('clientAcceptedRide', (data:NewRideDriverRequest) =>{
      this.dialogRefNewRideRequest.close();
      this.dialog.open(InRideDriverDialogComponent,{
        data:{ride: data.ride}
      });
      
      this.tokensService.currentUserTokensChangedSubject.next('');
      this.messageService.showMessage("Klijent je prihvatio vožnju!", MessageType.SUCCESS);
    });
    
    this.socket.on('clientDeniedRide', (data:NewRideDriverRequest) =>{
      this.dialogRefNewRideRequest.close();
      this.messageService.showMessage("Klijent je odbacio vožnju!", MessageType.INFO);
    });
  }
}
