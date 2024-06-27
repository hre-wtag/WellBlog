import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { AuthUser } from '../interfaces/authUser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  setUserData(user: User): void {
    console.log(user);

    localStorage.setItem('registeredUser', JSON.stringify(user));
  }
  authenticateUser(authUser: AuthUser): boolean {
    const user = this.getUserData();
    if (
      user &&
      user.username === authUser.username &&
      user.password === authUser.password
    ) {
      this.setLoginStatus(true);
      return true;
    }

    return false;
  }

  getUserData(): User {
    let user;
    const storedUserData = localStorage.getItem('registeredUser');
    if (storedUserData) {
      user = JSON.parse(storedUserData);
    }
    return user;
  }
  setLoginStatus(status: boolean): void {
    localStorage.setItem('loginStatus', JSON.stringify(status));
  }
  isLoggedIn(): boolean {
    const statusString = localStorage.getItem('loginStatus');
    if (statusString) {
      const status = JSON.parse(statusString);
      return status;
    }
    return false;
  }
  removeUserAuth(): void {
    localStorage.removeItem('loginStatus');
  }
}
