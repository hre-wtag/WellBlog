import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../../core/interfaces/user';
import { ValidatorsService } from '../../core/services/validators.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import {
  EMAIL_REGEX,
  LOGIN_ROUTE,
  PASSWORD_REGEX,
  SLASH,
} from '../../core/utils/constants';
import { ToggleOnHoldDirective } from '../../shared/Directives/toggle-on-hold.directive';
import { ToasterService } from '../../core/services/toaster.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    ToggleOnHoldDirective
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword: boolean | Event = false;
  showConfirmPassword: boolean | Event = false;
  confirmPasswordError: string | null = null;
  login_route: string = SLASH + LOGIN_ROUTE;
  passwordField: boolean | Event = false;
  confirmPasswordField: boolean | Event = false;
  activeField: string = '';
  passMatched: boolean = false;
  private validatorService = inject(ValidatorsService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private toasterService = inject(ToasterService);
  constructor() {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        this.validatorService.noSpacesValidator(),
        Validators.minLength(3),
        Validators.maxLength(15),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        this.validatorService.noSpacesValidator(),
        Validators.minLength(3),
        Validators.maxLength(15),
      ]),
      email: new FormControl('', [
        Validators.required,
        this.validatorService.noSpacesValidator(),
        Validators.pattern(EMAIL_REGEX),
      ]),
      username: new FormControl('', [
        Validators.required,
        this.validatorService.noSpacesValidator(),
        Validators.minLength(3),
        Validators.maxLength(15),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        this.validatorService.noSpacesValidator(),
        Validators.pattern(PASSWORD_REGEX),
      ]),
      confirmPassword: new FormControl('', Validators.required),
    });
  }

  onHoldChange(event: Event | boolean, field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.showPassword = event as boolean;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = event as boolean;
    }
  }

  onLogin(): void {
    this.router.navigate([this.login_route]);
  }
  onRegister(): void {
    if (this.registerForm.valid && this.passMatched) {
      const user: User = { ...this.registerForm.value, joiningDate: Date() };
      this.authService.registerUser(user);
      this.router.navigate([this.login_route]);
      this.toasterService.success('Success!', 'Registration successful!');
      setTimeout(() => {
        this.toasterService.clear();
      }, 4000);
    }
  }
  isFieldValid(fieldname: string): boolean {
    if (
      !this.registerForm.get(fieldname)?.valid &&
      this.registerForm.get(fieldname)?.touched
    ) {
      return true;
    }
    return false;
  }
  getFormControl = (formGroup: FormGroup, formControlName: string) => {
    return formGroup.get(formControlName) as FormControl;
  };
  updateErrorMessages(fControlName: string): string | null {
    let fControl = this.registerForm.get(fControlName);
    if (fControl?.touched && fControl?.errors) {
      return this.validatorService.getErrorMessages(fControl.errors);
    }
    return null;
  }

  matchPassword(): void {
    if (
      this.registerForm.get('password')?.value !==
      this.registerForm.get('confirmPassword')?.value
    ) {
      this.passMatched = false;
      this.confirmPasswordError = 'Password and confirm password must match.';
    } else {
      this.passMatched = true;
      this.confirmPasswordError = null;
    }
  }
}
