import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { HomeComponent } from './features/home/home.component';

// export const notLoggedInGuard: CanMatch = (route, state) => {
//   const isLoggedIn = AuthService.isLoggedIn();
//   if (isLoggedIn) {
//     return null; // Prevent route activation if logged in
//   }
//   return true; // Allow access if not logged in
// };

export const routes: Routes = [
  { path: '', title: 'Home', component: HomeComponent },
  {
    path: 'login',
    title: 'Login',
    component: LoginComponent,
  },
  {
    path: 'register',
    title: 'Register',
    component: RegisterComponent,
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
