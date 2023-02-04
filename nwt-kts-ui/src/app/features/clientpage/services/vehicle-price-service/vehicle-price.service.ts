import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiPaths } from 'src/environments/ApiPaths';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehiclePriceService {

  constructor(private http: HttpClient) { }

  getVehiclePrice(typeNumber: number) {
    const options = typeNumber ?
    {
      params: new HttpParams()
        .set('typeNumber', typeNumber-1)
    } : {};
    let url = `${environment.baseUrl}/${ApiPaths.VehiclePrice}/price`;
    return this.http.get(url, options);
  }
}
