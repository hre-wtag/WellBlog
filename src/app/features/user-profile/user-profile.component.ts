import { Component, OnInit, inject } from '@angular/core';
import { UserInfoComponent } from './user-info/user-info.component';
import { AddBlogComponent } from './add-blog/add-blog.component';
import { BlogCardComponent } from '../blog-card/blog-card.component';
import { Observable, map } from 'rxjs';
import { BlogService } from '../../core/services/blog.service';
import { Blog } from '../../core/interfaces/blog';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { EditUserComponent } from './edit-user/edit-user.component';
import { TooltipDirective } from '../../shared/Directives/tooltip.directive';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    UserInfoComponent,
    AddBlogComponent,
    BlogCardComponent,
    CommonModule,
    EditUserComponent,
    TooltipDirective,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  clickedBTN: string | null = null;
  blogService = inject(BlogService);
  authService = inject(AuthService);
  blogList$: Observable<Blog[]> | null = null;
  hasBlogs: boolean = false;
  showTooltip: boolean = false;

  ngOnInit(): void {
    this.blogList$ = this.blogService.blogs$.asObservable().pipe(
      map((blogs: Blog[] | null) => {
        if (blogs) {
          const filteredBlogs = blogs
            .filter(
              (blog: Blog) =>
                blog.bloggerId === this.authService.user$.getValue()?.id
            )
            .sort(
              (a, b) =>
                new Date(b.postingDate).getTime() -
                new Date(a.postingDate).getTime()
            );
          this.hasBlogs = filteredBlogs.length > 0;
          return filteredBlogs;
        } else {
          this.hasBlogs = false;
          return [];
        }
      })
    );
  }

  clickedHeaderBTN(btn: string): void {
    this.clickedBTN = btn;
  }

  handleAddFormSubmitted(formSubmitted: string | null): void {
    this.clickedBTN = formSubmitted;
  }
}
