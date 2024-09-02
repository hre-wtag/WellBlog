import { Component, inject } from '@angular/core';
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
import { InputComponent } from '../../shared/input/input.component';
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
    InputComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string | null = null;
  home_route: string = HOME_ROUTE;
  register_route: string = REGISTER_ROUTE;
  private validatorService = inject(ValidatorsService);
  private router = inject(Router);
  private authService = inject(AuthService);
  constructor() {
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
  getFormControl = (formGroup: FormGroup, formControlName: string) => {
    return formGroup.get(formControlName) as FormControl;
  };

  onRegister(): void {
    this.router.navigate([this.register_route]);
  }
  onLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }
    const user: AuthUser = this.loginForm.value;
    const loginStatus = this.authService.authenticateUser(user);
    if (loginStatus === true) {
      this.router.navigate([this.home_route]);
      this.loginError = null;
    } else {
      this.loginError = 'Incorrect username or password.';
    }
  }
}
