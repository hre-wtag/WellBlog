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
  private blogService = inject(BlogService);
  blogList: Blog[] | null = null;
  blogGroups: Blog[][] | null = null;
  heroBlog: Blog | null = null;
  default_profile_photo: string = DEFAULT_PROFILE_PHOTO_SRC;
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);
  private sharedService = inject(SharedService);
  isLoggedin: boolean = false;
  isFiltered: boolean = false;
  filteredTag: string = '';
  baseHeaderTitle: string = 'Latest Posts';
  headerTitle: string = this.baseHeaderTitle;

  isSearched: boolean = false;
  hasBlogs: boolean = false;
  itemsLoaded: number = 6;
  isPaginated: boolean | undefined = false;

  ngOnInit(): void {
    const blogSubcription = this.blogService.blogs$.subscribe((blogs) => {
      this.blogList = blogs;
    });
    this.destroyRef.onDestroy(() => blogSubcription.unsubscribe());

    if ((this.blogList?.length ?? 0) > 0) {
      this.heroBlog = this.blogList?.[(this.blogList?.length ?? 0) - 1] ?? null;
    }
    this.loadBlogs();
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
  }
  loadBlogs(): void {
    this.isPaginated = (this.blogList?.length ?? 0) > this.itemsLoaded;
    this.blogGroups =
      this.groupBlogs(
        this.blogList?.sort(
          (a, b) =>
            new Date(b.postingDate).getTime() -
            new Date(a.postingDate).getTime()
        )
      ) ?? null;
  }

  groupBlogs(blogs: Blog[] | null | undefined): Blog[][] {
    const groupedBlogs: Blog[][] = [];
    if (blogs) {
      for (let i = 0; i < Math.min(this.itemsLoaded, blogs.length); i += 3) {
        groupedBlogs.push(blogs.slice(i, i + 3));
      }
    }
    console.log(groupedBlogs);
    this.hasBlogs = groupedBlogs.length > 0;
    return groupedBlogs;
  }


  loadMore() {
    this.itemsLoaded += 3;
    this.loadBlogs();
  }

  handleSelectedTag(tag: string): void {
    this.filteredTag = tag;
    this.isFiltered = true;
    this.headerTitle = 'Filtered Blogs';
    this.blogService.blogs$
      .pipe(
        map((blogs) => blogs?.filter((blog) => blog.tags.includes(tag))),
        map((filteredBlogs) => this.groupBlogs(filteredBlogs))
      )
      .subscribe((groupedBlogs) => (this.blogGroups = groupedBlogs));
  }

  clearFilter(): void {
    this.isFiltered = false;
    this.ngOnInit();
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
