import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FareHistoryDTO } from 'src/app/features/homepage/models/FareHistoryDTO';
import { ApiPaths } from 'src/environments/ApiPaths';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FareService {
  private FARES_URL: string = `${environment.baseUrl}/${ApiPaths.Fares}`;

  constructor(private http: HttpClient) {}

  getFaresByClient(
    id: number,
    page: number,
    sort: string
  ): Observable<FareHistoryDTO> {
    let url = `${this.FARES_URL}/client?id=${id}&page=${page}&sort=${sort}`;
    return this.http.get<FareHistoryDTO>(url);
  }

  getFaresByDriver(
    id: number,
    page: number,
    sort: string
  ): Observable<FareHistoryDTO> {
    let url = `${this.FARES_URL}/driver?id=${id}&page=${page}&sort=${sort}`;
    return this.http.get<FareHistoryDTO>(url);
  }

  getFaresAdmin(page: number, sort: string): Observable<FareHistoryDTO> {
    let url = `${this.FARES_URL}/admin?page=${page}&sort=${sort}`;
    return this.http.get<FareHistoryDTO>(url);
  }
}
