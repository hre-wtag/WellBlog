import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
}
