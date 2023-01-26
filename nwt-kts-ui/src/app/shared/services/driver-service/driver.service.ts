import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { ApiPaths } from 'src/environments/ApiPaths';
import { environment } from 'src/environments/environment';
import { Driver } from '../../models/Driver';
import { DriverStatus } from '../../models/enums/DriverStatus';
import { Ride } from '../../models/Ride';
import * as L from 'leaflet';
import { NewPositionsForDriver } from '../../models/NewPositionsForDriver';

const io = require('socket.io-client');

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  
  socket: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  taxiPositions: Map<string,L.Marker> = new Map<string,L.Marker>();
  map:any;

  taxiFreeIcon = L.icon({
    iconUrl: 'assets/taxi-free.png',
    iconSize: [32, 32]
  });
  
  taxiUnavailableIcon = L.icon({
    iconUrl: 'assets/taxi-unavailable.png',
    iconSize: [32, 32]
  });

  taxiInRideIcon = L.icon({
    iconUrl: 'assets/taxi-ride.png',
    iconSize: [32, 32]
  });

  urlDrivers:string =`${environment.baseUrl}/${ApiPaths.Drivers}`;  

  constructor(private http: HttpClient) {
  }


  getAllDrivers(): Observable<Driver[]>{
    let url = `${this.urlDrivers}/all`;
    return this.http.get<Driver[]>(url);
  }

  getDriverStatus(driverId:number):Observable<DriverStatus>{
    let url = `${this.urlDrivers}/driverStatus/${driverId}`;
    return this.http.get<DriverStatus>(url);  
  }

  changeDriverStatus(driverId:number,isAvailable:boolean){
    let url = `${this.urlDrivers}/changeDriverStatus/${driverId}`;
    return this.http.post<Driver[]>(url,isAvailable);
  }

  logOutDriver(){
    let url = `${this.urlDrivers}/logOutDriver`;
    return this.http.post<Driver[]>(url,{});   
  }


  setMap(map:any){
    this.map = map;
    this.setAllTaxiDrivers();
    this.setUpSocket();
  }

  private setAllTaxiDrivers(){

    this.getAllDrivers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (drivers) =>{
          drivers.forEach( (driver) =>{
              let markerForDriver = L.marker([driver.positionLatitude,driver.positionLongitude]);
              if(driver.driverStatus == DriverStatus.AVAILABLE){
                markerForDriver.setIcon(this.taxiFreeIcon);
                markerForDriver.bindPopup("Vozilo je slobodno");
              }
              else if( driver.driverStatus == DriverStatus.UNAVAILABLE){
                markerForDriver.bindPopup("Vozilo nije dostupno");
                markerForDriver.setIcon(this.taxiUnavailableIcon);
              }
              else if (driver.driverStatus == DriverStatus.DRIVING){
                markerForDriver.bindPopup("Vozilo u voznji!");
                markerForDriver.setIcon(this.taxiInRideIcon);
              }
              // markerForDriver.addTo(this.map);
              this.taxiPositions.set( driver.vehiclePlateNumber, markerForDriver);
              this.taxiPositions.get(driver.vehiclePlateNumber)?.addTo(this.map);
          })
          console.log("saljem azurirane taxiste iz servisa!");
          // this.taxiChangeSubject.next(this.taxiPositions);
        }
      );
  }
  
  private setUpSocket(){

    this.socket = io(environment.chatSocketEndpoint);
    this.socket.on("newPositionForDriver", (data:NewPositionsForDriver)=>{
      // console.log(data);
      this.taxiPositions.get(data.plateNumber)?.setLatLng([data.newPosition[0],data.newPosition[1]]);
      // this.taxiChangeSubject.next(this.taxiPositions);
    });
    this.socket.on('driver-change-status', (driver:Driver) =>{
      let icon = this.taxiFreeIcon;
      if(driver.driverStatus == DriverStatus.AVAILABLE){
        icon = this.taxiFreeIcon;
      }
      else if( driver.driverStatus == DriverStatus.DRIVING){
        icon = this.taxiInRideIcon;
      }
      else if( driver.driverStatus == DriverStatus.UNAVAILABLE){
        icon = this.taxiUnavailableIcon;
      }

      this.taxiPositions.get(driver.vehiclePlateNumber)?.setIcon(icon);
      // this.taxiChangeSubject.next(this.taxiPositions);
    });
    console.log("socket for map is set up!");
  }

}
