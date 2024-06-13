import { Component, OnInit } from '@angular/core';
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
import { Router } from '@angular/router';
import { LOGIN_ROUTE } from '../../core/utils/constants';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  firstNameError: string | null = null;
  lastNameError: string | null = null;
  emailError: string | null = null;
  usernameError: string | null = null;
  passwordError: string | null = null;
  login_route: string = LOGIN_ROUTE;

  constructor(
    private validatorService: ValidatorsService,
    private authService: AuthService,
    private router: Router
  ) {
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
        Validators.email,
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
        this.validatorService.passwordValidator(),
      ]),
    });
  }
  ngOnInit() {}
  onRegister() {
    const user: User = this.registerForm.value;
    console.log('User registration successful!');
    console.log(user);
    this.authService.setUserData(user);
    this.router.navigate([this.login_route]);
  }
  onTouched(fieldName: string) {
    const control = this.registerForm.get(fieldName);
    if (control) {
      control.markAsTouched();
      this.updateErrorMessages();
    }
  }

  updateErrorMessages() {
    this.firstNameError = null;
    this.lastNameError = null;
    this.emailError = null;
    this.usernameError = null;
    this.passwordError = null;

    const fisrtnameControl = this.registerForm.get('firstname');
    const lastameControl = this.registerForm.get('lastname');
    const emailControl = this.registerForm.get('email');
    const usernameControl = this.registerForm.get('username');
    const passwordControl = this.registerForm.get('password');

    if (fisrtnameControl?.touched && fisrtnameControl?.errors) {
      this.firstNameError = this.validatorService.getErrorMessages(
        fisrtnameControl.errors
      );
    }
    if (lastameControl?.touched && lastameControl?.errors) {
      this.lastNameError = this.validatorService.getErrorMessages(
        lastameControl.errors
      );
    }
    if (emailControl?.touched && emailControl?.errors) {
      this.emailError = this.validatorService.getErrorMessages(
        emailControl.errors
      );
    }
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
}
