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

  register(
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    username: string
  ): Observable<User> {
    return from(
      this.supabase
        .from('user')
        .insert({
          firstname: firstname,
          lastname: lastname,
          username: username,
          password: password,
          email: email,
        })
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

  updateUser(user: User): Observable<User> {
    return from(
      this.supabase
        .from('user')
        .update(user)
        .match({ id: user.id })
        .select()
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
}
