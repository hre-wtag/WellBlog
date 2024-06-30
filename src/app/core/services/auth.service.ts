import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { AuthUser } from '../interfaces/authUser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  registerUser(user: User): void {
    localStorage.setItem('registeredUser', JSON.stringify(user));
  }

  authenticateUser(authUser: AuthUser): boolean {
    let user;
    const storedUserData = localStorage.getItem('registeredUser');
    if (storedUserData) {
      user = JSON.parse(storedUserData);
    }
    if (
      user &&
      user.username === authUser.username &&
      user.password === authUser.password
    ) {
      this.setLoggedInUser(user);
      return true;
    }
    return false;
  }

  setLoggedInUser(user: User): void {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
  }
  getLoggedInUser(): User | null {
    const loggedInUserString = localStorage.getItem('loggedInUser');
    return loggedInUserString ? JSON.parse(loggedInUserString) : null;
  }

  isLoggedIn(): boolean {
    const loggedInUserString = localStorage.getItem('loggedInUser');
    return loggedInUserString ? true : false;
  }
  removeLoggedInUser(): void {
    localStorage.removeItem('loggedInUser');
  }
}
