import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { BlogService } from '../../core/services/blog.service';
import { map } from 'rxjs';
import { Blog } from '../../core/interfaces/blog';
import { BlogCardComponent } from '../blog-card/blog-card.component';
import { CommonModule } from '@angular/common';
import { TooltipDirective } from '../../shared/Directives/tooltip.directive';
import {
  DEFAULT_PROFILE_PHOTO_SRC,
  PROFILE_ROUTE,
  REGISTER_ROUTE,
  SLASH,
  START_JOURNY_IMAGE_SRC,
} from '../../core/utils/constants';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/interfaces/user';
import { SharedService } from '../../core/services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, BlogCardComponent, TooltipDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  blogList: Blog[] | null = null;
  blogGroups: Blog[][] | null = null;
  heroBlog: Blog | null = null;
  isLoggedin: boolean = false;
  isFiltered: boolean = false;
  isSearched: boolean = false;
  hasBlogs: boolean = false;
  emptyBlogList: boolean = false;
  isPaginated: boolean | undefined = false;
  filteredTag: string = '';
  baseHeaderTitle: string = 'Latest Posts';
  headerTitle: string = this.baseHeaderTitle;
  welcomeBTNText: string = 'Join Now';
  registerRoute: string = SLASH + REGISTER_ROUTE;
  profileRoute: string = SLASH + PROFILE_ROUTE;
  default_profile_photo: string = DEFAULT_PROFILE_PHOTO_SRC;
  start_journey_image: string = START_JOURNY_IMAGE_SRC;
  initialItemsToLoad: number = 6;
  itemsLoaded: number = this.initialItemsToLoad;
  private blogService = inject(BlogService);
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);
  private sharedService = inject(SharedService);
  private router = inject(Router);

  ngOnInit(): void {
    const blogSubcription = this.blogService.blogs$.subscribe(
      (blogs: Blog[] | null) => {
        this.blogList = blogs;
        this.emptyBlogList = this.blogList?.length === 0;
      }
    );
    this.destroyRef.onDestroy(() => blogSubcription.unsubscribe());

    this.loadBlogs();

    const userSubcription = this.authService.user$.subscribe(
      (user: User | null) => {
        if (user) {
          this.isLoggedin = true;
          this.welcomeBTNText = 'Add Blogs';
        } else {
          this.isLoggedin = false;
        }
      }
    );
    
    this.destroyRef.onDestroy(() => userSubcription.unsubscribe());

    const seachTextSub = this.sharedService.searchedText.subscribe({
      next: (text: string) => {
        this.clearFilter();
        this.handleSearch(text);
      },
      error: (err: Error) => {
        console.error(err);
      },
    });
    this.destroyRef.onDestroy(() => seachTextSub.unsubscribe());
  }

  loadBlogs(): void {
    this.isPaginated = (this.blogList?.length ?? 0) > this.itemsLoaded;
    this.blogGroups =
      this.groupBlogs(
        this.blogList?.sort(
          (a, b) =>
            new Date(b.postingdate).getTime() -
            new Date(a.postingdate).getTime()
        )
      ) ?? null;
    if ((this.blogList?.length ?? 0) > 0) {
      this.heroBlog = this.blogList?.[(this.blogList?.length ?? 0) - 1] ?? null;
    }
  }

  groupBlogs(blogs: Blog[] | null | undefined): Blog[][] {
    const groupedBlogs: Blog[][] = [];
    if (blogs) {
      for (let i = 0; i < Math.min(this.itemsLoaded, blogs.length); i += 3) {
        groupedBlogs.push(blogs.slice(i, i + 3));
      }
    }
    this.hasBlogs = groupedBlogs.length > 0;
    return groupedBlogs;
  }

  loadMore(): void {
    this.itemsLoaded += 3;
    this.loadBlogs();
  }

  handleSelectedTag(tag: string): void {
    this.sharedService.searchedText.emit('');
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
    this.itemsLoaded = this.initialItemsToLoad;
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
        map((blogs: Blog[] | null) =>
          blogs?.filter((blog: Blog) =>
            blog.title.toLowerCase().includes(str.toLowerCase())
          )
        ),
        map((filteredBlogs: Blog[] | undefined) =>
          this.groupBlogs(filteredBlogs)
        )
      )
      .subscribe((groupedBlogs) => (this.blogGroups = groupedBlogs));
  }

  addBlog(): void {
    if (this.isLoggedin) {
      this.router.navigate([this.profileRoute]);
      this.sharedService.onClickingAddBlog('add-blog');
    } else {
      this.router.navigate([this.registerRoute]);
    }
  }
}
