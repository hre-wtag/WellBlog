import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { Blog } from '../../core/interfaces/blog';
import {
  BLOG_ROUTE,
  DEFAULT_PROFILE_PHOTO_SRC,
  PROFILE_ROUTE,
  SLASH,
} from '../../core/utils/constants';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BlogService } from '../../core/services/blog.service';
import { ToasterService } from '../../core/services/toaster.service';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog-card.component.html',
  styleUrl: './blog-card.component.scss',
})
export class BlogCardComponent implements OnInit, OnChanges {
  @Input() blog!: Blog;
  @Input() filteredTag: string | null = null;
  @Output() selectedFilterTag = new EventEmitter<string>();
  default_profile_photo: string = DEFAULT_PROFILE_PHOTO_SRC;
  blog_route: string = SLASH + BLOG_ROUTE;
  formattedBlogTitle: string = '';
  showDeleteBtn: boolean = false;
  profile_route: string = SLASH + PROFILE_ROUTE;

  private router = inject(Router);
  private blogService = inject(BlogService);
  private toasterService = inject(ToasterService);

  ngOnInit(): void {
    if (this.blog) {
      this.formattedBlogTitle =
        this.blog.title.length > 30
          ? this.blog.title.slice(0, 30) + '...'
          : this.blog.title;
    }
  }

  ngOnChanges(): void {
    this.showDeleteBtn = this.router.url === this.profile_route ? true : false;
    this.sortTagsBasedOnFilter(this.blog.tags);
  }

  onDelete(id: number): void {
    const blogDeleted = this.blogService.deleteBlog(id);
    if (blogDeleted) {
      this.toasterService.success('Success!', 'The blog is Deleted.');
      setTimeout(() => {
        this.toasterService.toasterInfo$.next(null);
      }, 4000);
    } else {
      this.toasterService.error('Error!', 'Unable to delete the blog.');
      setTimeout(() => {
        this.toasterService.toasterInfo$.next(null);
      }, 4000);
    }
  }

  onFilterTag(tag: string): void {
    this.selectedFilterTag.emit(tag);
  }

  private sortTagsBasedOnFilter(tagList: string[]): void {
    if (this.filteredTag && tagList?.length) {
      const filteredTagIndex = tagList.indexOf(this.filteredTag);
      if (filteredTagIndex !== -1) {
        const tags = [...tagList];
        [tags[0], tags[filteredTagIndex]] = [tags[filteredTagIndex], tags[0]];
        this.blog.tags = tags;
      }
    } else {
      this.blog.tags = tagList?.sort() || [];
    }
  }
}
