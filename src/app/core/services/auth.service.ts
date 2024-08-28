import { inject, Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { AuthUser } from '../interfaces/authUser';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$ = new BehaviorSubject<User | null>(null);
  private supabaseService = inject(SupabaseService);
  registerUser(user: User): void {
    this.supabaseService
      .register(
        user.firstname,
        user.lastname,
        user.email,
        user.password,
        user.username
      )
      .subscribe({
        next: (data) => {
          console.log('Data inserted successfully:', data);
        },
        error: (error) => {
          console.error('Error inserting data:', error.message);
          throw error;
        },
      });
  }

  validateUsername(username: string): boolean {
    // return storedUsers?.find((user) => user.username === username)
    //   ? true
    //   : false;
    return false;
  }

  authenticateUser(authUser: AuthUser): Observable<boolean> {
    return this.supabaseService
      .login(authUser.username, authUser.password)
      .pipe(
        map((user: User | null) => {
          if (user) {
            console.log('Login successful:', user);
            this.user$.next(user);
            this.setLoggedInUser(user);
            return true;
          } else {
            console.error('Login failed: Invalid username or password');
            return false;
          }
        }),
        catchError((error: Error) => {
          console.error('Error during login:', error.message);
          return throwError(() => false);
        })
      );
  }

  setLoggedInUser(user: User): void {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
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
    // let oldUser = storedUsers?.find((user) => user.id === user.id);
    // if (oldUser) {
    //   Object.assign(oldUser, user);

    //   this.setLoggedInUser(user);
    //   return true;
    // }
    return false;
  }
}
