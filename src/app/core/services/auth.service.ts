import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { AuthUser } from '../interfaces/authUser';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$ = new BehaviorSubject<User | null>(null);

  registerUser(user: User): void {
    localStorage.setItem('registeredUser', JSON.stringify(user));
  }

  authenticateUser(authUser: AuthUser): boolean {
    let user:User|null=null;
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
    this.user$.next(user);
  }
  isLoggedIn(): boolean {
    const loggedInUserString = localStorage.getItem('loggedInUser');
    try {
      if (loggedInUserString) {
        const user = JSON.parse(loggedInUserString);
        this.user$.next(user);
      } else {
        this.user$.next(null);
      }
    } catch (error) {
      console.error('Error parsing loggedInUserString:', error);
    }
    return loggedInUserString ? true : false;
  }

  removeLoggedInUser(): void {
    this.user$.next(null);
    localStorage.removeItem('loggedInUser');
  }
}
