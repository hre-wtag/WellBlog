import { Component, Input } from '@angular/core';
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
export class BlogCardComponent {
  @Input() blog!: Blog;
  default_profile_photo: string = DEFAULT_PROFILE_PHOTO_SRC;
  blog_route = SLASH + BLOG_ROUTE;
  onDelete(id: number): void {
    console.log(id);
  }
  get getRouterLink() {
    return `${this.blog_route}/${this.blog.id}`;
  }
}
