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
import { Router } from '@angular/router';
import { HOME_ROUTE } from '../../core/utils/constants';
import { AuthService } from '../../core/services/auth.service';
import { HeaderComponent } from '../../shared/header/header.component';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,HeaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  usernameError: string | null = null;
  passwordError: string | null = null;
  home_route: string = HOME_ROUTE;

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
        Validators.minLength(8),
        this.validatorService.noSpacesValidator(),
        this.validatorService.passwordValidator(),
      ]),
    });
  }
  ngOnInit() {
  }
  onLogin() {
    if (this.loginForm.invalid) {
      return;
    }
    const user: AuthUser = this.loginForm.value;
    console.log(user.username, user.password);
    const loginStatus = this.authService.authenticateUser(user);
    console.log(loginStatus);
    if (loginStatus === true) {
      this.router.navigate([this.home_route]);
    }
    this.usernameError = null;
    this.passwordError = null;
  }

  updateErrorMessages() {
    this.usernameError = null;
    this.passwordError = null;

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

  onTouched(fieldName: string) {
    const control = this.loginForm.get(fieldName);
    if (control) {
      control.markAsTouched();
      this.updateErrorMessages();
    }
  }
}
