import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/environments/ApiPaths';
import { environment } from 'src/environments/environment';
import { UserDTO } from '../../models/UserDTO';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url:string =`${environment.baseUrl}/${ApiPaths.Users}`;  

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<UserDTO[]>{
    let url = `${this.url}/all`;
    return this.http.get<UserDTO[]>(url);
  }

  getUser( userId:number ): Observable<UserDTO>{
    let url = `${this.url}/getUser/${userId}`;
    return this.http.get<UserDTO>(url);
  }
}
