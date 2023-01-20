import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from 'src/app/features/startpage/services/login-service/login.service';
import { NewRideDriverRequest } from 'src/app/shared/models/NewRideDriverRequest';
import { environment } from 'src/environments/environment';
import { NewRideDriverDialogComponent } from '../dialogs/new-ride-driver-dialog/new-ride-driver-dialog.component';

const io = require('socket.io-client');

@Component({
  selector: 'app-driver-homepage',
  templateUrl: './driver-homepage.component.html',
  styleUrls: ['./driver-homepage.component.css']
})
export class DriverHomepageComponent implements OnInit {

  socket:any;
  
  constructor(public dialog:MatDialog,
    private loginService:LoginService) { }

  ngOnInit(): void {
    this.setupSocketConnection();
  }

  setupSocketConnection() {
    this.socket = io(environment.chatSocketEndpoint);
    
    this.socket.emit('join', this.loginService.user?.id);
    this.socket.on('newRideRequest', (data: NewRideDriverRequest) => {
      console.log(data);
      const dialogRef = this.dialog.open(NewRideDriverDialogComponent,
        {
          data:{ ride: data.ride },
          height:"80%",
          width:"60%"
        })
    });
  }
}
