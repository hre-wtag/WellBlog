import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { BlogService } from '../../core/services/blog.service';
import { map } from 'rxjs';
import { Blog } from '../../core/interfaces/blog';
import { BlogCardComponent } from '../blog-card/blog-card.component';
import { CommonModule } from '@angular/common';
import { TooltipDirective } from '../../shared/Directives/tooltip.directive';
import { DEFAULT_PROFILE_PHOTO_SRC } from '../../core/utils/constants';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/interfaces/user';
import { SharedService } from '../../core/services/shared.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, BlogCardComponent, TooltipDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  blogGroups: Blog[][] | null = null;
  heroBlog: Blog | null = null;
  default_profile_photo: string = DEFAULT_PROFILE_PHOTO_SRC;
  isLoggedin: boolean = false;
  isFiltered: boolean = false;
  filteredTag: string = '';
  baseHeaderTitle: string = 'Latest Posts';
  headerTitle: string = this.baseHeaderTitle;
  isSearched: boolean = false;
  hasBlogs: boolean = false;

  private blogService = inject(BlogService);
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);
  private sharedService = inject(SharedService);

  ngOnInit(): void {
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
    this.sharedService.searchedText.subscribe((text) => {
      this.handleSearch(text);
    });
    this.loadBlogs();
    this.heroBlog = this.blogGroups ? this.blogGroups[0][0] : null;
  }
  loadBlogs(): void {
    const blogSubcription = this.blogService.blogs$.subscribe((blogs) => {
      this.blogGroups = this.groupBlogs(blogs) ?? null;
    });
    this.destroyRef.onDestroy(() => blogSubcription.unsubscribe());
  }
  groupBlogs(blogs: Blog[] | null | undefined): Blog[][] {
    const groupedBlogs: Blog[][] = [];
    if (blogs) {
      for (let i = 0; i < blogs.length; i += 3) {
        groupedBlogs.push(blogs.slice(i, i + 3));
      }
    }
    this.hasBlogs = groupedBlogs.length > 0;
    return groupedBlogs;
  }

  handleSelectedTag(tag: string): void {
    this.filteredTag = tag;
    this.isFiltered = true;
    this.headerTitle = 'Filtered Blogs';
    this.blogService.blogs$
      .pipe(
        map((blogs) =>
          this.groupBlogs(blogs?.filter((blog) => blog.tags.includes(tag)))
        )
      )
      .subscribe((groupedBlogs) => (this.blogGroups = groupedBlogs));
  }

  clearFilter(): void {
    this.isFiltered = false;
    this.loadBlogs();
    this.filteredTag = '';
    this.headerTitle = this.baseHeaderTitle;
  }
  handleSearch(str: string): void {
    this.isSearched = str !== undefined && str !== '';
    this.headerTitle = this.isSearched
      ? 'Searched Blogs'
      : this.baseHeaderTitle;

    this.blogService.blogs$
      .pipe(
        map((blogs) =>
          blogs?.filter((blog) =>
            blog.title.toLowerCase().includes(str.toLowerCase())
          )
        ),
        map((filteredBlogs) => this.groupBlogs(filteredBlogs))
      )
      .subscribe((groupedBlogs) => (this.blogGroups = groupedBlogs));
  }
}
