import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { BlogService } from '../../core/services/blog.service';
import { bufferCount, map, Observable } from 'rxjs';
import { Blog } from '../../core/interfaces/blog';
import { BlogCardComponent } from '../blog-card/blog-card.component';
import { CommonModule } from '@angular/common';
import { TooltipDirective } from '../../shared/Directives/tooltip.directive';
import { DEFAULT_PROFILE_PHOTO_SRC } from '../../core/utils/constants';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/interfaces/user';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, BlogCardComponent, TooltipDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private blogService = inject(BlogService);
  blogGroups: Blog[][] | null = null;
  heroBlog: Blog | null = null;
  default_profile_photo: string = DEFAULT_PROFILE_PHOTO_SRC;
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);
  isLoggedin: boolean = false;
  ngOnInit(): void {
    this.blogService.blogs$.subscribe((blogs) => {
      this.blogGroups = this.groupBlogs(blogs) ?? null;
    });
    this.heroBlog = this.blogGroups ? this.blogGroups[0][0] : null;
    console.log(this.blogGroups, 'blogs');
    const userSubcription = this.authService.user$.subscribe(
      (user: User | null) => {
        if (user) {
          this.isLoggedin = true;
        } else {
          this.isLoggedin = false;
        }
      }
    );
    this.destroyRef.onDestroy(() => userSubcription.unsubscribe());
  }

  groupBlogs(blogs: Blog[] | null): Blog[][] {
    const groupedBlogs: Blog[][] = [];
    if (blogs) {
      for (let i = 0; i < blogs.length; i += 3) {
        groupedBlogs.push(blogs.slice(i, i + 3));
      }
    }
    return groupedBlogs;
  }
}
