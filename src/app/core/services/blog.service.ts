import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { Blog } from '../interfaces/blog';
import { AuthService } from './auth.service';
import { User } from '../interfaces/user';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  blogs$ = new BehaviorSubject<Blog[] | null>(null);
  blog$ = new BehaviorSubject<Blog | null>(null);
  //blogUpdated = signal(false);
  private authService = inject(AuthService);
  private supaService = inject(SupabaseService);

  constructor() {
    this.getBlogs();
  }

  isMyBlog(bloggerid: number): boolean {
    let isMyBlog = false;
    const userSub = this.authService.user$.subscribe((user: User | null) => {
      isMyBlog = user?.id === bloggerid;
    });
    userSub.unsubscribe();
    return isMyBlog;
  }

  updateBlog(updatedBlog: Blog): Observable<boolean> {
    return this.supaService.updateBlog(updatedBlog).pipe(
      map((response) => {
        if (!response) {
          console.error('Error updating blog:', response);
          return false;
        }
       // this.getSingleBlog(updatedBlog.id);
      //  this.blogUpdated.set(true);
        this.blog$.next(updatedBlog);
        return true;
      }),
      catchError((error: Error) => {
        console.error('Error while updating blog:', error.message);
        return throwError(() => false);
      })
    );
  }

  addBlog(newBlog: Blog): Observable<boolean> {
    return this.supaService.addBlog(newBlog).pipe(
      map((response) => {
        if (!response) {
          console.error('Error adding blog:', response);
          return false;
        }
        this.getBlogs();
        return true;
      }),
      catchError((error: Error) => {
        console.error('Error while adding blog:', error.message);
        return throwError(() => false);
      })
    );
  }

  deleteBlog(id: number): Observable<boolean> {
    return this.supaService.deleteBlog(id).pipe(
      map((response) => {
        if (!response) {
          console.error('Error deleting blog:', response);
          return false;
        }
        this.getBlogs();
        return true;
      }),
      catchError((error: Error) => {
        console.error('Error while deleting blog:', error.message);
        return throwError(() => false);
      })
    );
  }

  getBlogs(): void {
    this.supaService.getAllBlog().subscribe({
      next: (blogs) => {
        this.blogs$.next(blogs);
      },
      error: (error) => {
        console.error('Error fetching blogs:', error.message);
        throw error;
      },
    });
  }
  getSingleBlog(id: number): Observable<Blog | null> {
    return this.supaService.getSingleBlog(id).pipe(
      map((blog: Blog | null) => {
        if (blog) {
          console.log('Fetching blog successful.', blog);
          this.blog$.next(blog);
          return blog;
        } else {
          console.error('Error fetching blogs');
          this.blog$.next(null);
          return null;
        }
      }),
      catchError((error: Error) => {
        console.error('Error fetching blogs:', error.message);
        this.blog$.next(null);

        return throwError(() => null);
      })
    );
  }
}
