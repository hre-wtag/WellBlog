import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { AuthUser } from '../interfaces/authUser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  setUserData(user: User) {
    localStorage.setItem('registeredUser', JSON.stringify(user));
  }
  authenticateUser(authUser: AuthUser): boolean {
    const user = this.getUserData();
    if (
      user.username === authUser.username &&
      user.password === authUser.password
    ) {
      this.setLoginStatus(true);
      return true;
    }

    return false;
  }

  getUserData() {
    let user;
    const storedUserData = localStorage.getItem('registeredUser');
    if (storedUserData) {
      user = JSON.parse(storedUserData);
      console.log(user);
    }
    return user;
  }
  setLoginStatus(status: boolean) {
    localStorage.setItem('loginStatus', JSON.stringify(status));
  }
  getLoginStatus(): boolean {
    const statusString = localStorage.getItem('loginStatus');
    if (statusString) {
      const status = JSON.parse(statusString);
      console.log(status);
      return status;
    }
    return false;
  }
  removeUserAuth() {
    localStorage.removeItem('loginStatus');
  }
}
