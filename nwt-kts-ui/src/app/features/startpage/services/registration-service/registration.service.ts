import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AdminRegistrationData } from 'src/app/features/homepage/models/AdminRegistrationData';
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

  sendAdminRegistrationRequest(
    data: AdminRegistrationData
  ): Observable<AdminRegistrationData> {
    let url = `${environment.baseUrl}/${ApiPaths.Registration}/adminRegister`;
    return this.http.post<AdminRegistrationData>(url, data);
  }
}
