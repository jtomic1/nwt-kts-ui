import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private httpClient: HttpClient) { }

  public getAddress(query: any) {
    const options = query ? 
    {
      params: new HttpParams()
          .set('format', 'geocodejson')
          .set('lat', query.lat)
          .set('lon', query.lng)
          .set('accept-language', 'en-US')
    } : {};
    let url = `${environment.nominatimUrl}/reverse`;
    return this.httpClient.get(url, options);    
  }

  public getCoordinates(query: string) {
    const options = query ? 
    {
      params: new HttpParams()
          .set('q', query)
          .set('format', 'geocodejson')
    } : {};
    let url = `${environment.nominatimUrl}/search`;
    return this.httpClient.get(url, options);
  }
}
