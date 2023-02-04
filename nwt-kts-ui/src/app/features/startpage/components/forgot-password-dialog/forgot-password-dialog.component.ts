import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import {
  MessageService,
  MessageType,
} from 'src/app/shared/services/message-service/message.service';
import { LoginService } from '../../services/login-service/login.service';

@Component({
  selector: 'app-forgot-password-dialog',
  templateUrl: './forgot-password-dialog.component.html',
  styleUrls: ['./forgot-password-dialog.component.css'],
})
export class ForgotPasswordDialogComponent implements  OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  email: FormControl = new FormControl('');
  constructor(
    public dialogRef: MatDialogRef<ForgotPasswordDialogComponent>,
    private loginService: LoginService,
    private messageService: MessageService
  ) {}

  

  onConfirmClick(): void {
    this.loginRequest();
  }

  onCancelClick(): void {
    this.dialogRef.close(false);
  }

  loginRequest() {
    let data: { email: string } = { email: this.email.value };
    this.loginService
      .sendPasswordResetRequest(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.messageService.showMessage(err.error.message, MessageType.ERROR);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
