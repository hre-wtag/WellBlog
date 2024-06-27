import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { EMAIL_REGEX } from '../utils/constants';

@Injectable({
  providedIn: 'root',
})
export class ValidatorsService {
  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value as string;
      const hasNumber = /\d/.test(password);
      const hasSpecialChar = /[^\w\s]/.test(password);
      const hasChar = /[a-zA-Z]/.test(password);

      if (!hasNumber || !hasSpecialChar || !hasChar) {
        return { pattern: true };
      }
      return null;
    };
  }
  noSpacesValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      if (value && /\s/.test(value)) {
        return { noSpaces: true };
      }
      return null;
    };
  }

  getErrorMessages(errors: ValidationErrors): string {
    let errorMessage = '';
    if (errors['noSpaces']) {
      return 'Spaces are not allowed.';
    } else if (errors['required']) {
      errorMessage = 'This field is required.';
    } else if (errors['minlength']) {
      errorMessage = `Minimum length is ${errors['minlength'].requiredLength}.`;
    } else if (errors['maxlength']) {
      errorMessage = `Maximum length is ${errors['maxlength'].requiredLength}.`;
    } else if (errors['pattern']) {
      if (errors['pattern'].requiredPattern === EMAIL_REGEX.toString()) {
        errorMessage = 'Please enter a valid email address.';
      } else {
        errorMessage =
          'Password must contain at least one character, one number and one special character.';
      }
    }
    return errorMessage;
  }
}
