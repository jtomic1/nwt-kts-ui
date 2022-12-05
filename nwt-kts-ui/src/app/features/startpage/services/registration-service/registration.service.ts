import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ApiPaths } from 'src/environments/ApiPaths';
import { environment } from 'src/environments/environment';
import { RegistrationData } from '../../models/RegistrationData';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  constructor(private http: HttpClient) {}

  sendRegistrationRequest(
    data: RegistrationData
  ): Observable<RegistrationData> {
    let url = `${environment.baseUrl}/${ApiPaths.Registration}/register`;
    return this.http.post<RegistrationData>(url, data);
  }
}
