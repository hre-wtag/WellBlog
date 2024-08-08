import { Component, inject, Input, OnChanges } from '@angular/core';
import { Blog } from '../../core/interfaces/blog';
import {
  BLOG_ROUTE,
  DEFAULT_PROFILE_PHOTO_SRC,
  PROFILE_ROUTE,
  SLASH,
} from '../../core/utils/constants';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

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
  showDeleteBtn: boolean = false;
  profile_route: string = SLASH + PROFILE_ROUTE;
  private router = inject(Router);
  ngOnChanges(): void {
    this.showDeleteBtn = this.router.url === this.profile_route ? true : false;
  }
  onDelete(id: number): void {
    console.log(id);
  }
}
