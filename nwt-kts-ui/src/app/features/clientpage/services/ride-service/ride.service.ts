import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ride } from 'src/app/shared/models/Ride';
import { ApiPaths } from 'src/environments/ApiPaths';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RideService {

  constructor(private http: HttpClient) { }

  orderRide(data: Ride) {
    let url = `${environment.baseUrl}/${ApiPaths.Ride}/order`;
    return this.http.post<Ride>(url, data);
  }
}
