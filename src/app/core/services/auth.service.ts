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
    const uId = this.getLatestUserID();
    let userWithID = { ...user, id: uId + 1 };
    let storedUsers = this.getRegisteredUsers();
    let usersArray = storedUsers ? [...storedUsers, userWithID] : [userWithID];
    this.setRegisteredUsers(usersArray);
  }
  setRegisteredUsers(usersArray: User[]): void {
    localStorage.setItem('registeredUsers', JSON.stringify(usersArray));
  }
  getRegisteredUsers(): User[] | null {
    const storedUserData = localStorage.getItem('registeredUsers');
    return storedUserData ? JSON.parse(storedUserData) : null;
  }
  getLatestUserID(): number {
    let storedUsers = this.getRegisteredUsers();
    if (storedUsers) {
      storedUsers.sort((a, b) => b.id - a.id);
      return storedUsers[0].id;
    }
    return 0;
  }
  validateUsername(username: string): boolean {
    let storedUsers = this.getRegisteredUsers();

    return storedUsers?.find((user) => user.username === username)
      ? true
      : false;
  }

  authenticateUser(authUser: AuthUser): boolean {
    let storedUsers = this.getRegisteredUsers();
    if (storedUsers) {
      for (let user of storedUsers)
        if (
          user &&
          user.username === authUser.username &&
          user.password === authUser.password
        ) {
          this.setLoggedInUser(user);
          return true;
        }
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

  updateUser(user: User): boolean {
    let storedUsers = this.getRegisteredUsers();
    let oldUser = storedUsers?.find((user) => user.id === user.id);
    if (oldUser) {
      Object.assign(oldUser, user);
      this.setRegisteredUsers(storedUsers as User[]);
      this.setLoggedInUser(user);
      return true;
    }
    return false;
  }
}
