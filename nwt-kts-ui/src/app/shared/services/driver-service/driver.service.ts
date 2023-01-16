import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/environments/ApiPaths';
import { environment } from 'src/environments/environment';
import { Driver } from '../../models/Driver';
import { Ride } from '../../models/Ride';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  
  url:string =`${environment.baseUrl}/${ApiPaths.Drivers}`;  

  constructor(private http: HttpClient) {}

  
  startRideDriveSimulation(coordinates:Array<number[]>,ride: Ride){
    console.log("starting ride simulation");
    let url = `http://${environment.chatSocketEndpoint}/driveSimulation`;
    let data = { driver: ride.vehiclePlateNumber, values: coordinates};
    this.http.post(url , data).subscribe(
      {
        next: (res) =>{
          console.log(res);
        },
        error: (err) =>{
          console.log(err);
        }
      }
    )

  }

  getAllDrivers(): Observable<Driver[]>{
    let url = `${this.url}/all`;
    return this.http.get<Driver[]>(url);
  }

}
