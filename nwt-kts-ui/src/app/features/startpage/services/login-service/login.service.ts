import { SocialAuthService } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChangeUserDataDTO } from 'src/app/features/homepage/models/ChangeUserDataDTO';
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

  facebookFlag: boolean = false;

  constructor(
    private http: HttpClient,
    private authService: SocialAuthService
  ) {}

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

    if (data.user.role === Role.USER) data.user.roleString = 'Korisnik';
    else if (data.user.role === Role.ADMIN)
      data.user.roleString = 'Administrator';
    else if (data.user.role === Role.DRIVER) data.user.roleString = 'Vozač';

    localStorage.setItem('user-data', JSON.stringify(data.user));
    this.userChangedSubject.next(this.user!);
  }

  updateUser(dto: ChangeUserDataDTO): void {
    let user: User = this.user!;
    user.profilePhoto = dto.photo;
    user.phone = dto.phone;
    user.name = dto.name;
    user.lastName = dto.lastName;
    user.town = dto.town;
    localStorage.setItem('user-data', JSON.stringify(user));
  }

  logout() {
    this.authService.signOut(true);
    localStorage.clear();
    this.facebookFlag = false;
  }
}
