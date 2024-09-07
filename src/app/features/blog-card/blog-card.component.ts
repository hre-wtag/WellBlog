import { Component, Input, OnChanges } from '@angular/core';
import { Blog } from '../../core/interfaces/blog';
import {
  BLOG_ROUTE,
  DEFAULT_PROFILE_PHOTO_SRC,
  SLASH,
} from '../../core/utils/constants';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog-card.component.html',
  styleUrl: './blog-card.component.scss',
})
export class BlogCardComponent implements OnChanges {
  @Input() blog!: Blog;

  default_profile_photo: string = DEFAULT_PROFILE_PHOTO_SRC;
  blog_route: string = SLASH + BLOG_ROUTE;
  formattedBlogTitle: string = '';

  ngOnChanges(): void {
    if (this.blog) {
      this.formattedBlogTitle =
        this.blog.title.length > 30
          ? this.blog.title.slice(0, 30) + '...'
          : this.blog.title;
    }
  }

  onDelete(id: number): void {
    console.log(id);
  }
}
