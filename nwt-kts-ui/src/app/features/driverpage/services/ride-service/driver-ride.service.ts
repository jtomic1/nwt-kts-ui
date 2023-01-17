import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ride } from 'src/app/shared/models/Ride';
import { ApiPaths } from 'src/environments/ApiPaths';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DriverRideService {

  socektUrl :String = `http://${environment.chatSocketEndpoint}`;

  constructor(private http: HttpClient) { }

  acceptRide(data: Ride) {
    let url = `${environment.baseUrl}/${ApiPaths.Ride}/acceptRide`;
    return this.http.post<Ride>(url, data);
  }
  
  startRideDriveSimulation(coordinates:Array<number[]>,ride: Ride){
    console.log("starting ride simulation");
    let url = `${this.socektUrl}/driveSimulation`;
    let data = { driver: ride.vehiclePlateNumber, values: coordinates};
    this.http.post(url , data).subscribe();
  }

  stopRideDriveSimulation(plateNumber:string,ride:Ride){
    console.log("stoping ride simulation");
    let url = `${this.socektUrl}/stopSimulation`;
    let data = { driver: plateNumber , clientId: ride.clientId};
    this.http.post(url , data).subscribe();
    
  } 

  deniedRide(driverId:number,ride: Ride){
    let url = `${this.socektUrl}/deniedRide`;
    let data = { driverId: driverId, rideDTO: ride};
    this.http.post(url , data).subscribe();
  }

}
