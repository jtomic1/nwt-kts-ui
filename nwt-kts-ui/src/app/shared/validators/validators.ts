import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export const matchingPasswordsValidator: ValidatorFn = (
  form: AbstractControl
): ValidationErrors | null => {
  let formGroup = form as FormGroup;
  let pass = formGroup.controls['password'].value;
  let confirmPass = formGroup.controls['confirmPassword'].value;
  if (pass !== confirmPass) return { matchingPasswordsError: true };
  return null;
};
