import { inject, Injectable, signal } from '@angular/core';
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
  usernameExist = signal(false);

  registerUser(user: User): void {
    this.supabaseService.register(user).subscribe({
      next: (data) => {
        console.log('Username Exists:', data);
      },
      error: (error) => {
        console.error('Error checking username:', error);
        throw error;
      },
    });
  }

  validateUsername(username: string): void {
    this.supabaseService.checkUsername(username).subscribe({
      next: (data) => {
        console.log('Data inserted successfully:', data);
        this.usernameExist.set(data);
      },
      error: (error) => {
        console.error('Error inserting data:', error.message);
        throw error;
      },
    });
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

  updateUser(user: User): Observable<boolean> {
    return this.supabaseService.updateUser(user).pipe(
      map((response) => {
        if (!response) {
          console.error('Error updating user:', response);
          return false;
        }

        const updatedUser = response;
        console.log('User Updated:', updatedUser);
        this.setLoggedInUser(updatedUser);
        this.user$.next(updatedUser);
        return true;
      }),
      catchError((error: Error) => {
        console.error('Error during login:', error.message);
        return throwError(() => false);
      })
    );
  }
}
