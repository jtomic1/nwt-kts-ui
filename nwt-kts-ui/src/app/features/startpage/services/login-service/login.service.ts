import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Role } from 'src/app/shared/models/enums/Role';
import { User } from 'src/app/shared/models/User';
import { ApiPaths } from 'src/environments/ApiPaths';
import { environment } from 'src/environments/environment';
import { LoginData } from '../../models/LoginData';
import { LoginResponseData } from '../../models/LoginResponseData';
import { ResetPasswordDTO } from '../../models/ResetPasswordDTO';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private userChangedSubject = new BehaviorSubject<User>(this.user!);
  public userChanged = this.userChangedSubject.asObservable();

  constructor(private http: HttpClient) {}

  get token(): string | null {
    return localStorage.getItem('access-token');
  }

  get user(): User | null {
    let user: string | null = localStorage.getItem('user-data');
    if (user !== null) return JSON.parse(user);
    else return null;
  }

  get isTokenPresent(): boolean {
    return this.token !== null;
  }

  sendLoginRequest(data: LoginData): Observable<LoginData> {
    let url = `${environment.baseUrl}/${ApiPaths.Login}`;
    return this.http.post<LoginData>(url, data);
  }

  sendLoginWithFacebookRequest(data: { email: string }): Observable<LoginData> {
    let url = `${environment.baseUrl}/${ApiPaths.FBLogin}`;
    return this.http.post<LoginData>(url, data);
  }

  sendPasswordResetRequest(data: { email: string }): Observable<void> {
    let url = `${environment.baseUrl}/${ApiPaths.ForgotPassword}`;
    return this.http.post<void>(url, data);
  }

  sendTokenStatusRequest(token: string): Observable<{ tokenStatus: string }> {
    let url = `${environment.baseUrl}/${ApiPaths.GetTokenStatus}/${token}`;
    return this.http.get<{ tokenStatus: string }>(url);
  }

  sendResetPasswordRequest(
    resetPasswordDTO: ResetPasswordDTO
  ): Observable<void> {
    let url = `${environment.baseUrl}/${ApiPaths.ResetPassword}`;
    return this.http.post<void>(url, resetPasswordDTO);
  }

  setUserData(data: LoginResponseData): void {
    localStorage.clear();
    localStorage.setItem('access-token', data.accessToken);

    let roleStr = data.user.roleString.split('_')[1];
    data.user.role = Role[roleStr as keyof typeof Role];
    localStorage.setItem('user-data', JSON.stringify(data.user));
    this.userChangedSubject.next(this.user!);
  }

  logout() {
    localStorage.clear();
  }
}
