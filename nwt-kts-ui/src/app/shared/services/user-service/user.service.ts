import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChangeUserDataDTO } from 'src/app/features/homepage/models/ChangeUserDataDTO';
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

  getClientsCount(): Observable<number> {
    let url = `${this.url}/clients/count`;
    return this.http.get<number>(url);
  }

  getDriversCount(): Observable<number> {
    let url = `${this.url}/drivers/count`;
    return this.http.get<number>(url);
  }

  getClients(page: number, size: number): Observable<User[]>{
    let url = `${this.url}/clients`;
    return this.http.get<User[]>(url, {params: {page: page, size: size}});
  }

  getDrivers(page: number, size: number): Observable<User[]>{
    let url = `${this.url}/drivers`;
    return this.http.get<User[]>(url, {params: {page: page, size: size}});
  }

  blockUser(id: number): Observable<User>{
    let url = `${this.url}/block`;
    return this.http.get<User>(url, {params: {id: id}});
  }
  
  sendResetPasswordRequest(
    resetPasswordDTO: ResetPasswordDTO
  ): Observable<void> {
    let url = `${this.url}/resetPassword`;
    return this.http.post<void>(url, resetPasswordDTO);
  }

  sendChangeUserDataRequest(
    userDataDTO: ChangeUserDataDTO
  ): Observable<ChangeUserDataDTO> {
    let url = `${this.url}/changeUserData`;
    return this.http.post<ChangeUserDataDTO>(url, userDataDTO);
  }

  getClientsAndDrivers(): Observable<User[]> {
    let url =  `${this.url}/getClientsAndDrivers`;
    return this.http.get<User[]>(url);
  }
}
