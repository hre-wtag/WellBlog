import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/seretKeys';
import { catchError, first, from, map, Observable, of } from 'rxjs';
import { User } from '../interfaces/user';
import { Blog } from '../interfaces/blog';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  USER_TABELE: string = 'user';
  BLOG_TABELE: string = 'blog';

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  register(user: User): Observable<User> {
    return from(
      this.supabase
        .from(this.USER_TABELE)
        .insert({
          firstname: user.firstname,
          lastname: user.lastname,
          username: user.username,
          password: user.password,
          email: user.email,
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
        .from(this.USER_TABELE)
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
        .from(this.USER_TABELE)
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
        .from(this.USER_TABELE)
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

  addBlog(blog: Blog): Observable<boolean> {
    return from(
      this.supabase
        .from(this.BLOG_TABELE)
        .insert({
          title: blog.title,
          tags: blog.tags,
          blogimage: blog.blogimage,
          description: blog.description,
          bloggerid: blog.bloggerid,
        })
        .select()
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

  getAllBlog(): Observable<Blog[]> {
    return from(
      this.supabase
        .from(this.BLOG_TABELE)
        .select(`*, user ( firstname, lastname,profileimage )`)
    ).pipe(
      map((response) => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        return response.data.map(
          (blog: any): Blog => ({
            id: blog.id,
            title: blog.title,
            tags: JSON.parse(blog.tags), // Parse tags array from string
            blogimage: blog.blogimage,
            description: blog.description,
            postingdate: new Date(blog.postingdate), // Convert postingdate to Date object
            bloggerid: blog.bloggerid,
            bloggername: blog.user.firstname + ' ' + blog.user.lastname,
            bloggerimage: blog.user.profileimage,
          })
        );
      }),
      catchError((error) => {
        console.error('Error fetching blogs:', error.message);
        return of([]);
      })
    );
  }
}
