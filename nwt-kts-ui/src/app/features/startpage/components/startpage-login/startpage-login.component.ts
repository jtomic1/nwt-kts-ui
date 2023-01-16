import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.loginService.isTokenPresent) {
      this.redirectLoggedUser();
    }
    let activationStatus = this.route.snapshot.paramMap.get('status');

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
    if(this.loginService.user?.role == Role.DRIVER){
      this.router.navigate(["/driverHomePage"]);
    }

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
