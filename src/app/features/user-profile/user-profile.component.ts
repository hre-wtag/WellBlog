import { Component, OnInit, inject } from '@angular/core';
import { UserInfoComponent } from './user-info/user-info.component';
import { AddBlogComponent } from './add-blog/add-blog.component';
import { BlogCardComponent } from '../blog-card/blog-card.component';
import { Observable, map } from 'rxjs';
import { BlogService } from '../../core/services/blog.service';
import { Blog } from '../../core/interfaces/blog';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    UserInfoComponent,
    AddBlogComponent,
    BlogCardComponent,
    CommonModule,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  clickedAddBlog: boolean = false;
  blogService = inject(BlogService);
  authService = inject(AuthService);
  blogList$: Observable<Blog[]> | null = null;
  hasBlogs: boolean = false;
  ngOnInit(): void {
    this.blogList$ = this.blogService.blogs$.asObservable().pipe(
      map((blogs: Blog[] | null) => {
        console.log(blogs);
        if (blogs) {
          const filteredBlogs = blogs
            .filter(
              (blog) => blog.bloggerId === this.authService.user$.getValue()?.id
            )
            .sort(
              (a, b) =>
                new Date(b.postingDate).getTime() -
                new Date(a.postingDate).getTime()
            );
          this.hasBlogs = filteredBlogs.length > 0;

          console.log(filteredBlogs, filteredBlogs.length, this.hasBlogs);

          return filteredBlogs;
        } else {
          this.hasBlogs = false;
          return [];
        }
      })
    );
  }
}
