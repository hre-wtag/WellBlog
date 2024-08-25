import { inject, Injectable } from '@angular/core';
import {
  AuthResponse,
  AuthSession,
  createClient,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
import { environment } from '../../../environments/seretKeys';
import { from, Observable } from 'rxjs';

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
    this.supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, 'event');
      console.log(session, 'session');

      if (event === 'SIGNED_IN') {
      } else {
      }
    });
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
  register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    username: string,
  ): void {
    console.log(email);

    this.supabase.from('user').insert({
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: password,
      email: email
    }).select();
  }
  // login(username:string,password:string):Observable<AuthResponse> {
  //   const promise = this.supabase.auth.signInWithPassword({
  //     username: username,
  //     password: password,

  //   });
  //   return from(promise);
  // }
}
