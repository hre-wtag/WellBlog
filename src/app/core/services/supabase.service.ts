import { Injectable } from '@angular/core';
import {
  AuthSession,
  createClient,
  SupabaseClient,
} from '@supabase/supabase-js';
import { environment } from '../../../environments/seretKeys';
import { catchError, from, map, Observable, of } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  _session: AuthSession | null = null;
  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  // register(
  //   firstName: string,
  //   lastName: string,
  //   email: string,
  //   password: string,
  //   username: string,
  //   joiningDate: Date
  // ): Observable<AuthResponse> {
  //   const promise = this.supabase.auth.signUp({
  //     email: email,
  //     password: password,
  //     options: {
  //       data: {
  //         firstName: firstName,
  //         lastName: lastName,
  //         joiningDate: joiningDate,
  //         username: username,
  //       },
  //     },
  //   });
  //   return from(promise);
  // }

  // async register(
  //   firstName: string,
  //   lastName: string,
  //   email: string,
  //   password: string,
  //   username: string
  // ): Promise<void> {
  //   console.log(email);

  //   return from(
  //     this.supabase
  //       .from('user')
  //       .insert({
  //         firstname: firstName,
  //         lastname: lastName,
  //         username: username,
  //         password: password,
  //         email: email,
  //       })
  //       .select()
  //   )
  //     .pipe(
  //       map(({ data, error }) => {
  //         if (error) {
  //           throw error;
  //         }
  //         console.log('Data inserted successfully:', data);
  //       }),
  //       catchError((error) => {
  //         console.error('Error inserting data:', error);
  //         throw error;
  //       })
  //     )
  //     .toPromise();
  // }

  register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    username: string
  ): Observable<User[]> {
    return from(
      this.supabase
        .from('user')
        .insert({
          firstname: firstName,
          lastname: lastName,
          username: username,
          password: password,
          email: email,
        })
        .select()
    ).pipe(
      map((response) => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        return response.data;
      }),
      catchError((error) => {
        throw error;
      })
    );
  }

  login(username: string, password: string): Observable<User> {
    return from(
      this.supabase
        .from('user')
        .select('*')
        .match({ username, password })
        .single()
    ).pipe(
      map((response) => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        return response.data;
      }),
      catchError((error) => {
        throw error;
      })
    );
  }

  checkUsername(username: string): Observable<boolean> {
    return from(
      this.supabase
        .from('user')
        .select('username')
        .eq('username', username)
        .single()
    ).pipe(
      map((response) => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        return response.data ? true : false; 
      }),
      catchError(() => {
        return of(false);
      })
    );
  }
}
