import { Component, OnInit, effect, inject, signal } from '@angular/core';
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
import { SharedService } from '../../core/services/shared.service';

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
  blogList$: Observable<Blog[]> | null = null;
  hasBlogs = signal(false);
  showTooltip: boolean = false;
  addBlogTooltip: boolean = false;
  editProfileTooltip: boolean = false;

  clickedBTN: string | null = null;
  blogService = inject(BlogService);
  authService = inject(AuthService);
  private sharedService = inject(SharedService);

  constructor() {
    effect(() => {
      this.hasBlogs();
    });
  }

  ngOnInit(): void {
    this.blogList$ = this.blogService.blogs$.asObservable().pipe(
      map((blogs: Blog[] | null) => {
        if (blogs) {
          const filteredBlogs = blogs
            .filter(
              (blog: Blog) =>
                blog.bloggerid === this.authService.user$.getValue()?.id
            )
            .sort(
              (a, b) =>
                new Date(b.postingdate).getTime() -
                new Date(a.postingdate).getTime()
            );

          this.hasBlogs.set(filteredBlogs.length > 0);
          return filteredBlogs;
        } else {
          this.hasBlogs.set(false);
          return [];
        }
      })
    );
    this.clickedHeaderBTN(this.sharedService.clickedAddblog);
  }
  clickedHeaderBTN(btn: string): void {
    this.clickedBTN = btn;
  }

  handleAddFormSubmitted(formSubmitted: string | null): void {
    this.clickedBTN = formSubmitted;
  }
}
