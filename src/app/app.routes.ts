import { CanMatchFn, RedirectCommand, Router, Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { HomeComponent } from './features/home/home.component';
import { AuthService } from './core/services/auth.service';
import { PreviousRouteService } from './core/services/previous-route.service';
import { inject } from '@angular/core';
import { UserProfileComponent } from './features/user-profile/user-profile.component';
import {
  HOME_ROUTE,
  LOGIN_ROUTE,
  PROFILE_ROUTE,
  REGISTER_ROUTE,
} from './core/utils/constants';

const notLoggedInGuard: CanMatchFn = () => {
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

const loggedInGuard: CanMatchFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const prevRouteService = inject(PreviousRouteService);
  const isLoggedIn = authService.isLoggedIn();
  const previousUrl = prevRouteService.getPreviousUrl();

  if (isLoggedIn) {
    return true;
  }
  return new RedirectCommand(router.parseUrl(previousUrl));
};

export const routes: Routes = [
  { path: '', title: 'Home', component: HomeComponent },
  {
    path: LOGIN_ROUTE,
    title: 'Login',
    component: LoginComponent,
    canMatch: [notLoggedInGuard],
  },
  {
    path: REGISTER_ROUTE,
    title: 'Register',
    component: RegisterComponent,
    canMatch: [notLoggedInGuard],
  },
  {
    path: PROFILE_ROUTE,
    title: 'Profile',
    component: UserProfileComponent,
    canMatch: [loggedInGuard],
  },
  {
    path: '**',
    redirectTo: HOME_ROUTE,
  },
];
