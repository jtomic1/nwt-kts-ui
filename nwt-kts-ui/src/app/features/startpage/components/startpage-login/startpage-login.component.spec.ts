import { SocialAuthService } from '@abacritt/angularx-social-login';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'src/app/shared/services/message-service/message.service';
import { LoginServiceMock } from '../../mock/login.component.service.mock';
import { MatDialogMock } from '../../mock/mat-dialog.mock';
import { MessageServiceMock } from '../../mock/message-service.mock';
import { SocialAuthMockService } from '../../mock/social-auth.service.mock';
import { LoginService } from '../../services/login-service/login.service';

import { StartpageLoginComponent } from './startpage-login.component';

describe('StartpageLoginComponent', () => {
  let component: StartpageLoginComponent;
  let loginService: LoginService;
  let messageService: MessageService;
  let route: ActivatedRoute;
  let dialog: MatDialog;
  let authService: SocialAuthService;

  let fixture: ComponentFixture<StartpageLoginComponent>;
  let elem: DebugElement;
  let submitButton: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StartpageLoginComponent],
      imports: [RouterTestingModule, ReactiveFormsModule],
      providers: [
        {
          provide: LoginService,
          useClass: LoginServiceMock,
        },
        {
          provide: SocialAuthService,
          useClass: SocialAuthMockService,
        },
        {
          provide: MessageService,
          useClass: MessageServiceMock,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => {
                  return key;
                },
              },
            },
          },
        },
        {
          provide: MatDialog,
          useClass: MatDialogMock,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartpageLoginComponent);
    component = fixture.componentInstance;

    elem = fixture.debugElement.query(By.css('#login-button'));
    submitButton = elem.nativeElement;

    loginService = TestBed.inject(LoginService);
    messageService = TestBed.inject(MessageService);
    route = TestBed.inject(ActivatedRoute);
    dialog = TestBed.inject(MatDialog);
    authService = TestBed.inject(SocialAuthService);

    fixture.detectChanges();
  });

  it('should create StartpageLoginComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should confirm form is initially invalid', () => {
    expect(component.form.invalid).toBeTruthy();
  });

  it('should confirm that empty username/password field makes form invalid', () => {
    component.form.controls['username'].setValue('Testname');
    component.form.controls['username'].updateValueAndValidity();
    component.form.controls['password'].setValue('');
    component.form.controls['password'].updateValueAndValidity();
    fixture.detectChanges();

    expect(component.form.invalid).toBeTruthy();
  });

  it('should disable submit button when form is invalid', () => {
    expect((submitButton as HTMLButtonElement).disabled).toBeTrue();
  });

  it('should enable submit button when form is valid', () => {
    component.form.controls['username'].setValue('Testname');
    component.form.controls['password'].setValue('Testpassword');
    component.form.controls['username'].updateValueAndValidity();
    component.form.controls['password'].updateValueAndValidity();

    fixture.detectChanges();

    expect((submitButton as HTMLButtonElement).disabled).toBeFalse();
  });

  it('should call sendLoginRequest when button is clicked', () => {
    spyOn(component, 'loginRequest');
    component.form.controls['username'].setValue('Testname');
    component.form.controls['password'].setValue('Testpassword');
    component.form.controls['username'].updateValueAndValidity();
    component.form.controls['password'].updateValueAndValidity();
    fixture.detectChanges();

    (submitButton as HTMLButtonElement).click();

    expect(component.loginRequest).toHaveBeenCalledTimes(1);
  });
});
