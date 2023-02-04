import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChangeRequestDTO } from 'src/app/features/homepage/models/ChangeRequestDTO';
import { ApiPaths } from 'src/environments/ApiPaths';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private ADMIN_URL: string = `${environment.baseUrl}/${ApiPaths.Admin}`;

  constructor(private http: HttpClient) {}

  getAllChangeRequests(
    page: number
  ): Observable<{ count: number; res: ChangeRequestDTO[] }> {
    let url = `${this.ADMIN_URL}/changeRequests/all/${page}`;
    return this.http.get<{ count: number; res: ChangeRequestDTO[] }>(url);
  }

  approveChangeRequest(id: number): Observable<ChangeRequestDTO> {
    let url = `${this.ADMIN_URL}/changeRequests/approve/${id}`;
    return this.http.get<ChangeRequestDTO>(url);
  }

  denyChangeRequest(id: number): Observable<void> {
    let url = `${this.ADMIN_URL}/changeRequests/deny/${id}`;
    return this.http.get<void>(url);
  }
}
