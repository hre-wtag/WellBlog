import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  take,
  throwError,
} from 'rxjs';
import { Blog } from '../interfaces/blog';
import { AuthService } from './auth.service';
import { User } from '../interfaces/user';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  blogs$ = new BehaviorSubject<Blog[] | null>(null);

  private authService = inject(AuthService);
  private supaService = inject(SupabaseService);

  constructor() {
    // this.blogs$.next(this.loadBlogsFromLocalStorage() || []);
    this.supaService.getAllBlog().subscribe({
      next: (blogs) => {
        console.log(blogs, 'blogs');
        for (let blog of blogs) {
          console.log(blog.tags);
          blog.tags= blog.tags
        }

        this.blogs$.next(blogs);
      },
      error: (error) => {
        console.error('Error fetching blogs:', error.message);
        throw error;
      },
    });
  }

  isMyBlog(bloggerid: number): boolean {
    let isMyBlog = false;
    const userSub = this.authService.user$.subscribe((user: User | null) => {
      isMyBlog = user?.id === bloggerid;
    });
    userSub.unsubscribe();
    return isMyBlog;
  }

  updateBlog(updatedBlog: Blog): boolean {
    let isUpdated = false;
    this.blogs$
      .pipe(
        take(1),
        map((blogs) =>
          blogs?.map((blog) =>
            blog.id === updatedBlog.id ? updatedBlog : blog
          )
        )
      )
      .subscribe({
        next: (updatedBlogs) => {
          if (updatedBlogs) {
            this.blogs$.next(updatedBlogs);
            this.saveBlogsToLocalStorage(updatedBlogs);
            isUpdated = true;
          }
        },
        error: () => {
          isUpdated = false;
        },
      });
    return isUpdated;
  }

  private saveBlogsToLocalStorage(blogs: Blog[]): void {
    localStorage.setItem('blogs', JSON.stringify(blogs));
  }

  private loadBlogsFromLocalStorage(): Blog[] | null {
    const blogsJson = localStorage.getItem('blogs');
    if (blogsJson) {
      try {
        return JSON.parse(blogsJson);
      } catch (e) {
        console.error('Error parsing blogs from local storage', e);
        return null;
      }
    }
    return null;
  }

  addBlog(newBlog: Blog): Observable<boolean> {
    return this.supaService.addBlog(newBlog).pipe(
      map((response) => {
        if (!response) {
          console.error('Error adding blog:', response);
          return false;
        }
        return true;
      }),
      catchError((error: Error) => {
        console.error('Error while adding blog:', error.message);
        return throwError(() => false);
      })
    );
  }

  deleteBlog(id: number): boolean {
    let isDeleted = false;
    this.blogs$
      .pipe(
        take(1),
        map((blogs) => blogs?.filter((blog) => blog.id !== id)) // Filter out the blog to be deleted
      )
      .subscribe({
        next: (updatedBlogs) => {
          if (updatedBlogs) {
            this.blogs$.next(updatedBlogs);
            this.saveBlogsToLocalStorage(updatedBlogs);
            isDeleted = true;
          }
        },
        error: () => {
          isDeleted = false;
        },
      });
    return isDeleted;
  }
}
