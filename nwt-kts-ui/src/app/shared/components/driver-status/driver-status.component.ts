import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { LoginService } from 'src/app/features/startpage/services/login-service/login.service';
import { DriverStatus } from '../../models/enums/DriverStatus';
import { DriverService } from '../../services/driver-service/driver.service';

@Component({
  selector: 'app-driver-status',
  templateUrl: './driver-status.component.html',
  styleUrls: ['./driver-status.component.css']
})
export class DriverStatusComponent implements OnInit {

  driverAvailable: boolean = false;
  driverId:number = -1;
  constructor(
    private loginService:LoginService,
    private driverService:DriverService
  ) { }

  ngOnInit(): void {
    this.loginService.userChanged.subscribe(
      (user)=>{
        this.driverId = user.id;
        this.getDriverStatus();
      }
    );
  }

  getDriverStatus(){
    this.driverService.getDriverStatus(this.driverId).subscribe({
      next:(res)=>{
        console.log(res);
        if(res == DriverStatus.AVAILABLE){
          this.driverAvailable = true;
        }
        else if( res == DriverStatus.UNAVAILABLE){
          this.driverAvailable = false;
        }
      }
    });
  }

  changeDriverStatus(event:MatSlideToggleChange){
    this.driverAvailable = event.checked;
    this.driverService.changeDriverStatus(this.driverId,this.driverAvailable).subscribe();
  }
}
