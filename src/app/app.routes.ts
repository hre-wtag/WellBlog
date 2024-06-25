import { Routes } from '@angular/router';
import { LOGIN_ROUTE, REGISTER_ROUTE } from './core/utils/constants';
import { HomeComponent } from './features/home/home.component';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: LOGIN_ROUTE,
    loadComponent: () =>
      import('./features/login/login.component').then(
        (mod) => mod.LoginComponent
      ),
  },
  {
    path: REGISTER_ROUTE,
    loadComponent: () =>
      import('./features/register/register.component').then(
        (mod) => mod.RegisterComponent
      ),
  },
];
