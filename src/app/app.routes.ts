import { CanMatchFn, RedirectCommand, Router, Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { HomeComponent } from './features/home/home.component';
import { AuthService } from './core/services/auth.service';
import { PreviousRouteService } from './core/services/previous-route.service';
import { inject } from '@angular/core';

export const notLoggedInGuard: CanMatchFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const prevRouteService = inject(PreviousRouteService);
  const isLoggedIn = authService.isLoggedIn();
  const previousUrl = prevRouteService.getPreviousUrl();

  if (!isLoggedIn) {
    return true;
  }

  return new RedirectCommand(router.parseUrl(previousUrl));
};

export const routes: Routes = [
  { path: '', title: 'Home', component: HomeComponent },
  {
    path: 'login',
    title: 'Login',
    component: LoginComponent,
    canMatch: [notLoggedInGuard],
  },
  {
    path: 'register',
    title: 'Register',
    component: RegisterComponent,
    canMatch: [notLoggedInGuard],
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
