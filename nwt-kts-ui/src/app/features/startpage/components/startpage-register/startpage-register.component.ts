import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import {
  MessageService,
  MessageType,
} from 'src/app/shared/services/message-service/message.service';
import { matchingPasswordsValidator } from 'src/app/shared/validators/validators';
import { RegistrationData } from '../../models/RegistrationData';
import { RegistrationService } from '../../services/registration-service/registration.service';

@Component({
  selector: 'app-startpage-register',
  templateUrl: './startpage-register.component.html',
  styleUrls: ['./startpage-register.component.css'],
})
export class StartpageRegisterComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  @Output() registrationEvent: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  registrationForm = this.createRegistrationForm();

  constructor(
    private messageService: MessageService,
    private registrationService: RegistrationService
  ) {}

  ngOnInit(): void {}

  createRegistrationForm(): FormGroup {
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
      },
      { validators: matchingPasswordsValidator }
    );
  }

  saveRequest() {
    if (this.registrationForm.invalid) {
      this.messageService.showMessage(
        'Registraciona forma nije adekvatno popunjena!',
        MessageType.ERROR
      );
    } else {
      let data: RegistrationData = this.registrationForm.getRawValue();
      this.registrationService
        .sendRegistrationRequest(data)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.showMessage(
              'Registracija uspešna! Aktivacioni E-mail je poslat na Vašu E-mail adresu!',
              MessageType.SUCCESS
            );
            this.registrationEvent.emit(true);
          },
          error: (err) => {
            this.messageService.showMessage(err, MessageType.ERROR);
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
