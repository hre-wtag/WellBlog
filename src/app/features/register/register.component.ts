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
} from '../../core/utils/constants';
import { HeaderComponent } from '../../shared/header/header.component';
import { ToggleOnHoldDirective } from '../../shared/Directives/toggle-on-hold.directive';
import { ButtonComponent } from '../../shared/button/button.component';
import { InputComponent } from '../../shared/input/input.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HeaderComponent,
    RouterLink,
    ToggleOnHoldDirective,
    ButtonComponent,
    InputComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm: FormGroup;
  confirmPasswordError: string | null = null;
  login_route: string = LOGIN_ROUTE;
  passwordField: boolean | Event = false;
  confirmPasswordField: boolean | Event = false;
  activeField: string = '';
  passMatched: boolean = false;
  private validatorService = inject(ValidatorsService);
  private router = inject(Router);
  private authService = inject(AuthService);
  constructor() {
    this.registerForm = new FormGroup({
      firstname: new FormControl('', [
        Validators.required,
        this.validatorService.noSpacesValidator(),
        Validators.minLength(3),
        Validators.maxLength(15),
      ]),
      lastname: new FormControl('', [
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

  onHoldChange(event: Event | boolean, activeField: string): void {
    this.activeField = activeField;
    if (this.activeField === 'password') {
      this.passwordField = event;
    } else if (this.activeField === 'confirmPassword') {
      this.confirmPasswordField = event;
    } else {
      this.activeField = '';
    }
  }
  onLogin(): void {
    this.router.navigate([this.login_route]);
  }
  onRegister(): void {
    if (this.registerForm.valid && this.passMatched) {
      const user: User = this.registerForm.value;
      this.authService.registerUser(user);
      this.router.navigate([this.login_route]);
    }
  }

  getFormControl = (formGroup: FormGroup, formControlName: string) => {
    return formGroup.get(formControlName) as FormControl;
  };

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
