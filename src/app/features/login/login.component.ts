import { Component, OnInit, inject } from '@angular/core';
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
import { ToggleOnHoldDirective } from '../../shared/Directives/toggle-on-hold.directive';
import { ToastrService } from 'ngx-toastr';
import { ToasterComponent } from '../../shared/toaster/toaster.component';
import { ToasterService } from '../../core/services/toaster.service';
import { Subject, debounceTime } from 'rxjs';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    ToggleOnHoldDirective,
    ToasterComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  home_route: string = HOME_ROUTE;
  register_route: string = REGISTER_ROUTE;
  showPassword: boolean | Event = false;
  loginError: boolean = false;
  private router = inject(Router);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private toasterService = inject(ToasterService);
  private sub = new Subject<AuthUser>();
  constructor() {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.sub.pipe(debounceTime(500)).subscribe((user: AuthUser) => {
      const loginStatus = this.authService.authenticateUser(user);
      if (loginStatus === true) {
        this.toasterService.clear();
        this.router.navigate([this.home_route]);
      } else {
        this.toasterService.error('Error!', 'Incorrect username or password!');
        setTimeout(() => {
          this.toasterService.clear();
        }, 3000);
      }
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
    this.sub.next(user);
  }

  onTouched(fieldName: string): void {
    const control = this.loginForm.get(fieldName);
    if (control) {
      control.markAsTouched();
    }
  }
}
