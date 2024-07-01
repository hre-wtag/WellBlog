import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthUser } from '../../core/interfaces/authUser';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HOME_ROUTE, REGISTER_ROUTE } from '../../core/utils/constants';
import { AuthService } from '../../core/services/auth.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { ToggleOnHoldDirective } from '../../shared/Directives/toggle-on-hold.directive';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HeaderComponent,
    RouterLink,
    ToggleOnHoldDirective,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string | null = null;
  home_route: string = HOME_ROUTE;
  register_route: string = REGISTER_ROUTE;
  showPassword: boolean | Event = false;
  private router = inject(Router);
  private authService = inject(AuthService);
  constructor() {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }
  onHoldChange(event: Event | boolean): void {
    this.showPassword = event;
  }
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

  onTouched(fieldName: string): void {
    const control = this.loginForm.get(fieldName);
    if (control) {
      control.markAsTouched();
    }
  }
}
