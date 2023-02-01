import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MessageService } from 'src/app/shared/services/message-service/message.service';
import { MessageServiceMock } from '../../mock/message-service.mock';
import { RegistrationServiceMock } from '../../mock/startpage-registration.mock';
import { RegistrationService } from '../../services/registration-service/registration.service';

import { StartpageRegisterComponent } from './startpage-register.component';

describe('StartpageRegisterComponent', () => {
  let component: StartpageRegisterComponent;
  let fixture: ComponentFixture<StartpageRegisterComponent>;
  let messageService: MessageService;
  let registrationService: RegistrationService;

  let elem: DebugElement;
  let submitButton: HTMLButtonElement;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StartpageRegisterComponent],
      providers: [
        {
          provide: MessageService,
          useClass: MessageServiceMock,
        },
        {
          provide: RegistrationService,
          useClass: RegistrationServiceMock,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartpageRegisterComponent);
    component = fixture.componentInstance;
    component.registrationForm = component.createRegistrationForm();

    elem = fixture.debugElement.query(By.css('#register-button'));
    submitButton = elem.nativeElement;

    messageService = TestBed.inject(MessageService);
    registrationService = TestBed.inject(RegistrationService);

    fixture.detectChanges();
  });

  it('should create StartpageRegisterComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should confirm form has invalid email error', () => {
    let emailControl = component.registrationForm.controls['email'];

    emailControl.setValue('invalidformat');
    emailControl.updateValueAndValidity();
    fixture.detectChanges();

    expect(emailControl.hasError('pattern')).toBeTruthy();
  });

  it('should confirm form email is valid', () => {
    let emailControl = component.registrationForm.controls['email'];

    emailControl.setValue('test@mail.com');
    emailControl.updateValueAndValidity();
    fixture.detectChanges();

    expect(emailControl.valid).toBeTruthy();
  });

  it('should confirm form has invalid phoneNumber error', () => {
    let phoneControl = component.registrationForm.controls['phoneNumber'];

    phoneControl.setValue('wasd123');
    phoneControl.updateValueAndValidity();
    fixture.detectChanges();

    expect(phoneControl.hasError('pattern')).toBeTruthy();
  });

  it('should confirm form phoneNumber is valid', () => {
    let phoneControl = component.registrationForm.controls['phoneNumber'];

    phoneControl.setValue('123456789');
    phoneControl.updateValueAndValidity();
    fixture.detectChanges();

    expect(phoneControl.valid).toBeTruthy();
  });

  it('should confirm password has min length error', () => {
    let passwordControl = component.registrationForm.controls['password'];

    passwordControl.setValue('short');
    passwordControl.updateValueAndValidity();
    fixture.detectChanges();

    expect(passwordControl.hasError('minlength')).toBeTruthy();
  });

  it('should confirm password has max length error', () => {
    let passwordControl = component.registrationForm.controls['password'];

    passwordControl.setValue('toolongtoolongtoolongtoolongtoolong');
    passwordControl.updateValueAndValidity();
    fixture.detectChanges();

    expect(passwordControl.hasError('maxlength')).toBeTruthy();
  });

  it('should confirm form password is valid', () => {
    let passwordControl = component.registrationForm.controls['password'];

    passwordControl.setValue('$nottooshort#');
    passwordControl.updateValueAndValidity();
    fixture.detectChanges();

    expect(passwordControl.valid).toBeTruthy();
  });

  it('should confirm form has matching passwords error', () => {
    component.registrationForm.controls['password'].setValue('testpass1');
    component.registrationForm.controls['confirmPassword'].setValue(
      'testpass2'
    );

    component.registrationForm.controls['password'].updateValueAndValidity();
    component.registrationForm.controls[
      'confirmPassword'
    ].updateValueAndValidity();

    fixture.detectChanges();

    expect(
      component.registrationForm.hasError('matchingPasswordsError')
    ).toBeTrue();
  });

  it('should confirm form is valid', () => {
    let form = component.registrationForm;

    form.controls['email'].setValue('test@email.com');
    form.controls['password'].setValue('testpass1');
    form.controls['confirmPassword'].setValue('testpass1');
    form.controls['name'].setValue('Testko');
    form.controls['lastName'].setValue('Testkovic');
    form.controls['town'].setValue('Novi Sad');
    form.controls['phoneNumber'].setValue('123412345');

    form.controls['email'].updateValueAndValidity();
    form.controls['password'].updateValueAndValidity();
    form.controls['confirmPassword'].updateValueAndValidity();
    form.controls['name'].updateValueAndValidity();
    form.controls['lastName'].updateValueAndValidity();
    form.controls['town'].updateValueAndValidity();
    form.controls['phoneNumber'].updateValueAndValidity();

    fixture.detectChanges();

    expect(form.valid).toBeTrue();
  });

  it('should confirm saveRequest is clicked', () => {
    let form = component.registrationForm;

    form.controls['email'].setValue('test@email.com');
    form.controls['password'].setValue('testpass1');
    form.controls['confirmPassword'].setValue('testpass1');
    form.controls['name'].setValue('Testko');
    form.controls['lastName'].setValue('Testkovic');
    form.controls['town'].setValue('Novi Sad');
    form.controls['phoneNumber'].setValue('123412345');

    form.controls['email'].updateValueAndValidity();
    form.controls['password'].updateValueAndValidity();
    form.controls['confirmPassword'].updateValueAndValidity();
    form.controls['name'].updateValueAndValidity();
    form.controls['lastName'].updateValueAndValidity();
    form.controls['town'].updateValueAndValidity();
    form.controls['phoneNumber'].updateValueAndValidity();

    fixture.detectChanges();

    spyOn(component, 'saveRequest');
    submitButton.click();
    expect(component.saveRequest).toHaveBeenCalledTimes(1);
  });
});
