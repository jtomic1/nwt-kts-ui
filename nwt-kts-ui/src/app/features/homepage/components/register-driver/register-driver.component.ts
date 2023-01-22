import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { RegistrationService } from 'src/app/features/startpage/services/registration-service/registration.service';
import {
  MessageService,
  MessageType,
} from 'src/app/shared/services/message-service/message.service';
import { matchingPasswordsValidator } from 'src/app/shared/validators/validators';
import { AdminRegistrationData } from '../../models/AdminRegistrationData';

@Component({
  selector: 'app-register-driver',
  templateUrl: './register-driver.component.html',
  styleUrls: ['./register-driver.component.css'],
})
export class RegisterDriverComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  form: FormGroup = this.createDriverRegistrationForm();

  vehicleTypes: { name: string; value: string }[] = [
    { name: 'Basic', value: 'Basic' },
    { name: 'Lux', value: 'Lux' },
    { name: 'Jumbo', value: 'Jumbo' },
    { name: 'Baby Friendly', value: 'Baby Friendly' },
    { name: 'Pet Friendly', value: 'Pet Friendly' },
  ];

  constructor(
    private registrationService: RegistrationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {}

  get enableSubmitButton(): boolean {
    return this.form.valid;
  }

  createDriverRegistrationForm(): FormGroup {
    return new FormGroup(
      {
        email: new FormControl(
          '',
          Validators.pattern('^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$')
        ),
        password: new FormControl(
          '',
          Validators.compose([
            Validators.minLength(8),
            Validators.maxLength(30),
          ])
        ),
        confirmPassword: new FormControl(''),
        name: new FormControl(''),
        lastName: new FormControl(''),
        town: new FormControl(''),
        phoneNumber: new FormControl('', Validators.pattern('^[0-9]{9,12}$')),
        vehicleName: new FormControl(''),
        plateNumber: new FormControl(''),
        capacity: new FormControl(1, [Validators.min(1), Validators.max(10)]),
        vehicleType: new FormControl('Basic'),
      },
      { validators: matchingPasswordsValidator }
    );
  }

  submitButtonClick(): void {
    let data: AdminRegistrationData = this.form.getRawValue();
    this.registrationService
      .sendAdminRegistrationRequest(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.showMessage(
            'Registracija vozača uspešna!',
            MessageType.SUCCESS
          );
          this.form = this.createDriverRegistrationForm();
        },
        error: (err) => {
          this.messageService.showMessage(err.error.message, MessageType.ERROR);
        },
      });
  }

  clearButtonClick(): void {
    this.form = this.createDriverRegistrationForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
