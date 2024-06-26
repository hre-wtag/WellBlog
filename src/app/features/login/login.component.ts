import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthUser } from '../../core/interfaces/authUser';
import { ValidatorsService } from '../../core/services/validators.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HOME_ROUTE, REGISTER_ROUTE } from '../../core/utils/constants';
import { AuthService } from '../../core/services/auth.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { ToggleOnHoldDirective } from '../../shared/Directives/toggle-on-hold.directive';
import { ButtonComponent } from '../../shared/button/button.component';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HeaderComponent,
    RouterLink,
    ToggleOnHoldDirective,
    ButtonComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  usernameError: string | null = null;
  passwordError: string | null = null;
  loginError: string | null = null;
  home_route: string = HOME_ROUTE;
  register_route: string = REGISTER_ROUTE;
  textFieldType: boolean | Event = false;

  constructor(
    private validatorService: ValidatorsService,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        this.validatorService.noSpacesValidator(),
        Validators.minLength(3),
        Validators.maxLength(15),
      ]),
      password: new FormControl('', [
        Validators.required,
        this.validatorService.noSpacesValidator(),
      ]),
    });
  }

  onHoldChange(event: Event | boolean): void {
    this.textFieldType = event;
  }
  onRegister(event: Event): void {
    event.preventDefault();
    this.router.navigate([this.register_route]);
  }
  onLogin(event: Event): void {
    event.preventDefault();
    if (this.loginForm.invalid) {
      return;
    }
    const user: AuthUser = this.loginForm.value;
    const loginStatus = this.authService.authenticateUser(user);
    if (loginStatus === true) {
      this.router.navigate([this.home_route]);
      this.usernameError = null;
      this.passwordError = null;
      this.loginError = null;
    } else {
      this.loginError = 'Incorrect username or password.';
    }
  }

  updateErrorMessages(): void {
    this.usernameError = null;
    this.passwordError = null;
    this.loginError = null;

    const usernameControl = this.loginForm.get('username');
    const passwordControl = this.loginForm.get('password');

    if (usernameControl?.touched && usernameControl?.errors) {
      this.usernameError = this.validatorService.getErrorMessages(
        usernameControl.errors
      );
    }

    if (passwordControl?.touched && passwordControl?.errors) {
      this.passwordError = this.validatorService.getErrorMessages(
        passwordControl.errors
      );
    }
  }

  onTouched(fieldName: string): void {
    const control = this.loginForm.get(fieldName);
    if (control) {
      control.markAsTouched();
      this.updateErrorMessages();
    }
  }
}
