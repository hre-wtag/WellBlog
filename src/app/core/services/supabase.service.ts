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

  USER_TABLE: string = 'user';
  BLOG_TABLE: string = 'blog';

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  register(user: User): Observable<User> {
    return from(
      this.supabase
        .from(this.USER_TABLE)
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
        .from(this.USER_TABLE)
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
        .from(this.USER_TABLE)
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
        .from(this.USER_TABLE)
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
        .from(this.BLOG_TABLE)
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
        .from(this.BLOG_TABLE)
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
            tags: JSON.parse(blog.tags),
            blogimage: blog.blogimage,
            description: blog.description,
            postingdate: new Date(blog.postingdate),
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
  deleteBlog(blogId: number): Observable<boolean> {
    console.log('supa service', blogId);

    return from(
      this.supabase.from(this.BLOG_TABLE).delete().match({ id: blogId })
    ).pipe(
      map((response) => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        return true;
      }),
      catchError((error) => {
        console.error('Error deleting blog:', error.message);
        return of(false);
      })
    );
  }
  updateBlog(blog: Blog): Observable<Blog | null> {
    return from(
      this.supabase
        .from(this.BLOG_TABLE)
        .update(blog)
        .match({ id: blog.id })
        .select(`*, user ( firstname, lastname,profileimage )`)
        .single()
    ).pipe(
      map((response) => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        if (response.data) {
          console.log(response.data,"blog data");
          
          return {
            id: response.data.id,
            title: response.data.title,
            tags: JSON.parse(response.data.tags),
            blogimage: response.data.blogimage,
            description: response.data.description,
            postingdate: new Date(response.data.postingdate),
            bloggerid: response.data.bloggerid,
            bloggername:
              response.data.user.firstname + ' ' + response.data.user.lastname,
            bloggerimage: response.data.user.profileimage,
          };
        } else {
          return null;
        }
      }),
      catchError((error) => {
        throw error;
      })
    );
  }
  getSingleBlog(id: number): Observable<Blog | null> {
    return from(
      this.supabase
        .from(this.BLOG_TABLE)
        .select(`*, user ( firstname, lastname,profileimage )`)
        .match({ id: id })
        .single()
    ).pipe(
      map((response) => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        if (response.data) {
          return {
            id: response.data.id,
            title: response.data.title,
            tags: JSON.parse(response.data.tags),
            blogimage: response.data.blogimage,
            description: response.data.description,
            postingdate: new Date(response.data.postingdate),
            bloggerid: response.data.bloggerid,
            bloggername:
              response.data.user.firstname + ' ' + response.data.user.lastname,
            bloggerimage: response.data.user.profileimage,
          };
        } else {
          return null;
        }
      }),
      catchError((error) => {
        console.error('Error fetching blog:', error.message);
        return of(null);
      })
    );
  }
}
