import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, take } from 'rxjs';
import { Blog } from '../interfaces/blog';
import { AuthService } from './auth.service';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  blogs$ = new BehaviorSubject<Blog[] | null>(null);

  private authService = inject(AuthService);
  constructor() {
    this.blogs$.next(this.loadBlogsFromLocalStorage() || []);
  }

  isMyBlog(bloggerId: number): boolean {
    let isMyBlog = false;
    const userSub = this.authService.user$.subscribe((user: User | null) => {
      isMyBlog = user?.id === bloggerId;
    });
    userSub.unsubscribe();
    return isMyBlog;
  }

  updateBlog(updatedBlog: Blog): void {
    this.blogs$
      .pipe(
        take(1),
        map((blogs) =>
          blogs?.map((blog) =>
            blog.id === updatedBlog.id ? updatedBlog : blog
          )
        )
      )
      .subscribe((updatedBlogs) => {
        if (updatedBlogs) {
          this.blogs$.next(updatedBlogs);
          this.saveBlogsToLocalStorage(updatedBlogs);
        }
      });
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

  addBlog(newBlog: Blog): void {
    this.blogs$
      .pipe(
        filter((blogs) => blogs !== null),
        map((blogs) => [...(blogs ?? []), newBlog]),
        take(1) // Ensures observable completes after emitting updatedBlogs
      )
      .subscribe((blogs) => {
        this.blogs$.next(blogs);
        this.saveBlogsToLocalStorage(blogs);
      });
  }
  deleteBlog(id: number): void {
    this.blogs$
      .pipe(
        take(1),
        map(
          (blogs) => blogs?.filter((blog) => blog.id !== id)
        )
      )
      .subscribe((updatedBlogs) => {
        if (updatedBlogs) {
          this.blogs$.next(updatedBlogs);
          this.saveBlogsToLocalStorage(updatedBlogs);
        }
      });
  }
}
