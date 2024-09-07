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
        }
      });
  }
}
