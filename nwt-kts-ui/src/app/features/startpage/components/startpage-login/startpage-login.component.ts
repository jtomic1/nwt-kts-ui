import { SocialAuthService } from '@abacritt/angularx-social-login';
import { FacebookLoginProvider } from '@abacritt/angularx-social-login';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { Role } from 'src/app/shared/models/enums/Role';
import {
  MessageService,
  MessageType,
} from 'src/app/shared/services/message-service/message.service';
import { LoginData } from '../../models/LoginData';
import { LoginService } from '../../services/login-service/login.service';
import { ForgotPasswordDialogComponent } from '../forgot-password-dialog/forgot-password-dialog.component';

@Component({
  selector: 'app-startpage-login',
  templateUrl: './startpage-login.component.html',
  styleUrls: ['./startpage-login.component.css'],
})
export class StartpageLoginComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  form: FormGroup = this.createLoginForm();

  faFacebook = faFacebook;
  faGoogle = faGoogle;

  constructor(
    private loginService: LoginService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private authService: SocialAuthService
  ) {}

  ngOnInit(): void {
    if (this.loginService.isTokenPresent) {
      this.redirectLoggedUser();
    }
    let activationStatus = this.route.snapshot.paramMap.get('status');
    if (activationStatus !== null)
      this.showActivationStatusMessage(activationStatus);

    this.authService.authState
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (this.loginService.facebookFlag) {
          this.loginWithFacebookRequest(user.email);
        }
      });
  }

  createLoginForm(): FormGroup {
    return new FormGroup({
      username: new FormControl(''),
      password: new FormControl(''),
    });
  }

  loginRequest() {
    let data: LoginData = this.form.getRawValue();
    this.loginService
      .sendLoginRequest(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.loginService.setUserData(res);
          this.redirectLoggedUser();
        },
        error: (err) => {
          this.messageService.showMessage(err.error.message, MessageType.ERROR);
        },
      });
  }

  redirectLoggedUser() {
    if (this.loginService.user?.role == Role.DRIVER) {
      this.router.navigateByUrl('home/driverHomePage');
    } else if (this.loginService.user?.role == Role.USER) {
      this.router.navigateByUrl('home/clientmap');
    } else {
      this.router.navigateByUrl('home');
    }
  }

  openForgotPasswordDialog() {
    const dialogRef = this.dialog.open(ForgotPasswordDialogComponent);

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.messageService.showMessage(
            'E-mail za promenu lozinke je uspešno poslat!',
            MessageType.SUCCESS
          );
        }
      });
  }

  loginWithFacebook() {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.loginService.facebookFlag = true;
  }

  loginWithFacebookRequest(email: string) {
    this.loginService
      .sendLoginWithFacebookRequest({ email: email })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.loginService.setUserData(res);
          this.redirectLoggedUser();
        },
        error: (err) => {
          this.messageService.showMessage(err.error.message, MessageType.ERROR);
        },
      });
  }

  showActivationStatusMessage(activationStatus: string) {
    switch (activationStatus) {
      case 'success': {
        this.messageService.showMessage(
          'Nalog uspešno aktiviran!',
          MessageType.SUCCESS
        );
        break;
      }
      case 'alreadyactive': {
        this.messageService.showMessage(
          'Nalog je već aktivan!',
          MessageType.WARNING
        );
        break;
      }
      case 'invalidactivation': {
        this.messageService.showMessage(
          'Neuspešan pokušaj aktivacije!',
          MessageType.ERROR
        );
        break;
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
