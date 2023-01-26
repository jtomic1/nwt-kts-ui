import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ride } from 'src/app/shared/models/Ride';
import { ApiPaths } from 'src/environments/ApiPaths';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RideService {

  url = `${environment.baseUrl}/${ApiPaths.Ride}`;
  socketUrl = `http://${environment.chatSocketEndpoint}`

  constructor(private http: HttpClient) { }

  isClientInRide(clientId:number):Observable<boolean>{
    let url = `${this.url}/isClientInRide/${clientId}`;
    return this.http.get<boolean>(url);
    
  }

  orderRide(data: Ride) {
    let url = `${this.url}/order`;
    return this.http.post<Ride>(url, data);
  }

  getDriverForRide(data:Ride){
    let url = `${this.url}/getDriverForRide`;
    return this.http.post<Ride>(url, data);  
  }

  clinetConfirmRide(data:Ride):Observable<string>{
    let url = `${this.url}/clientConfirmRide`;
    return this.http.post<string>(url, data);  
    
  }

  clientCancelRide(ride:Ride){
    let url = `${this.socketUrl}/client-denied`;
    let data = { driverId: ride.driverId, rideDTO: ride};
    this.http.post<string>(url, data).subscribe();  
  }

}
