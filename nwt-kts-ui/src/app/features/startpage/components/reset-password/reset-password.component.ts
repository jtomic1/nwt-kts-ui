import { Component, OnInit, OnDestroy, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  MessageService,
  MessageType,
} from 'src/app/shared/services/message-service/message.service';
import { UserService } from 'src/app/shared/services/user-service/user.service';
import { matchingPasswordsValidator } from 'src/app/shared/validators/validators';
import { ResetPasswordDTO } from '../../models/ResetPasswordDTO';
import { LoginService } from '../../services/login-service/login.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  form: FormGroup = this.getPasswordResetForm();
  token: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private messageService: MessageService,
    private userService: UserService,
    @Optional() private dialogRef: MatDialogRef<ResetPasswordComponent>
  ) {}

  ngOnInit(): void {
    if (!this.loginService.isTokenPresent) {
      const token = this.route.snapshot.paramMap.get('token');
      if (token !== null) {
        this.token = token;
        this.checkTokenValidity();
      }
    }
  }

  getPasswordResetForm(): FormGroup {
    return new FormGroup(
      {
        password: new FormControl(
          '',
          Validators.compose([
            Validators.minLength(8),
            Validators.maxLength(30),
          ])
        ),
        confirmPassword: new FormControl(''),
      },
      { validators: matchingPasswordsValidator }
    );
  }

  sendResetRequest(): void {
    let resetPasswordDTO: ResetPasswordDTO = {
      newPassword: this.form.controls['password'].value,
      confirmNewPassword: this.form.controls['confirmPassword'].value,
      token: this.token,
    };
    if (this.token === '')
      this.resetPasswordWithoutTokenRequest(resetPasswordDTO);
    else this.resetPasswordWithTokenRequest(resetPasswordDTO);
  }

  resetPasswordWithoutTokenRequest(resetPasswordDTO: ResetPasswordDTO) {
    this.userService
      .sendResetPasswordRequest(resetPasswordDTO)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.showMessage(
            'Lozinka uspešno promenjena',
            MessageType.SUCCESS
          );
          this.dialogRef.close();
        },
        error: (err) => {
          this.messageService.showMessage(err.error.message, MessageType.ERROR);
        },
      });
  }

  resetPasswordWithTokenRequest(resetPasswordDTO: ResetPasswordDTO) {
    this.loginService
      .sendResetPasswordRequest(resetPasswordDTO)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
          this.messageService.showMessage(
            'Lozinka uspešno promenjena',
            MessageType.SUCCESS
          );
        },
        error: (err) => {
          this.router.navigate(['/']);
          this.messageService.showMessage(err.error.message, MessageType.ERROR);
        },
      });
  }

  checkTokenValidity(): void {
    this.loginService
      .sendTokenStatusRequest(this.token)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: { tokenStatus: string }) => {
          if (res.tokenStatus !== 'UNRESOLVED')
            this.router.navigate(['/login']);
        },
        error: (err) => {
          this.router.navigate(['/']);
          this.messageService.showMessage(err.error.message, MessageType.ERROR);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
