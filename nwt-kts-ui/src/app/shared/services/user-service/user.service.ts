import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResetPasswordDTO } from 'src/app/features/startpage/models/ResetPasswordDTO';
import { ApiPaths } from 'src/environments/ApiPaths';
import { environment } from 'src/environments/environment';
import { User } from '../../models/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url: string = `${environment.baseUrl}/${ApiPaths.Users}`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    let url = `${this.url}/all`;
    return this.http.get<User[]>(url);
  }

  getUser(userId: number): Observable<User> {
    let url = `${this.url}/getUser/${userId}`;
    return this.http.get<User>(url);
  }

  sendResetPasswordRequest(
    resetPasswordDTO: ResetPasswordDTO
  ): Observable<void> {
    let url = `${this.url}/resetPassword`;
    return this.http.post<void>(url, resetPasswordDTO);
  }
}
