import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private baseUrl: string = 'https://nominatim.openstreetmap.org';

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
    return this.httpClient.get(this.baseUrl + '/reverse', options);    
  }

  public getCoordinates(query: string) {
    const options = query ? 
    {
      params: new HttpParams()
          .set('q', query)
          .set('format', 'geocodejson')
    } : {};
    return this.httpClient.get(this.baseUrl + '/search', options);
  }
}
