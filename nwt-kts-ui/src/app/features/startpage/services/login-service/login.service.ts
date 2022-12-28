import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Role } from 'src/app/shared/models/enums/Role';
import { User } from 'src/app/shared/models/User';
import { ApiPaths } from 'src/environments/ApiPaths';
import { environment } from 'src/environments/environment';
import { LoginData } from '../../models/LoginData';
import { LoginResponseData } from '../../models/LoginResponseData';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private accessToken: string | null = null;
  private _user: User | null = null;

  private userChangedSubject =new BehaviorSubject<User>(this._user!);
  public userChanged = this.userChangedSubject.asObservable();

  constructor(private http: HttpClient) {}

  get token(): string | null {
    return this.accessToken;
  }

  get user(): User | null {
    return this._user;
  }

  get isTokenPresent(): boolean {
    return this.token !== null;
  }

  sendLoginRequest(data: LoginData): Observable<LoginData> {
    let url = `${environment.baseUrl}/${ApiPaths.Login}`;
    return this.http.post<LoginData>(url, data);
  }

  setUserData(data: LoginResponseData): void {
    this.accessToken = data.accessToken;
    this._user = data.user;
    let roleStr = data.user.roleString.split('_')[1];
    this._user.role = Role[roleStr as keyof typeof Role];

    this.userChangedSubject.next(this._user);
    console.log(this._user);
    console.log("upisan u servis!");
  }

  logout() {
    this.accessToken = null;
    this._user = null;
  }
}
