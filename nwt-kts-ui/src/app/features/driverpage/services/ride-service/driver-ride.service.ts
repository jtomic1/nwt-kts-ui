import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ride } from 'src/app/shared/models/Ride';
import { ApiPaths } from 'src/environments/ApiPaths';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DriverRideService {

  constructor(private http: HttpClient) { }

  acceptRide(data: Ride) {
    let url = `${environment.baseUrl}/${ApiPaths.Ride}/acceptRide`;
    return this.http.post<Ride>(url, data);
  }


  startRideDriveSimulation(coordinates:Array<number[]>){
    console.log("starting ride simulation");
  }
}
