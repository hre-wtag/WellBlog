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
    this.user$.next(user);
  }


  isLoggedIn(): boolean {
    let isLoggedIn = false;
    this.user$.subscribe((user: User | null) => {
      isLoggedIn = user !== null;
    });
    return isLoggedIn;
  }
  removeLoggedInUser(): void {
    localStorage.removeItem('loggedInUser');
    this.user$.next(null);
  }
}
