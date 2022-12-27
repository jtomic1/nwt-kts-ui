import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import {
  MessageService,
  MessageType,
} from 'src/app/shared/services/message-service/message.service';
import { LoginData } from '../../models/LoginData';
import { LoginResponseData } from '../../models/LoginResponseData';
import { LoginService } from '../../services/login-service/login.service';

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
    private messageService: MessageService
  ) {}

  ngOnInit(): void {}

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
        },
        error: (err) => {
          this.messageService.showMessage(err, MessageType.ERROR);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
