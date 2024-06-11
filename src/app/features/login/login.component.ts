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
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  usernameError: string | null = null;
  passwordError: string | null = null;

  constructor(
    private validatorService: ValidatorsService,
    private router: Router
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
    console.log('Login Init!');
  }
  onLogin() {
    if (this.loginForm.invalid) {
      return;
    }
    const user: AuthUser = this.loginForm.value;
    console.log(user.username, user.password);
    this.usernameError = null;
    this.passwordError = null;
    if (user.username === 'user' && user.password === 'aaaa@1111') {
      alert('login Sucessfull!');
      this.router.navigate(['/']);
    }
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
