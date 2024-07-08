import { Component, Input } from '@angular/core';
import { Blog } from '../../core/interfaces/blog';
import { DEFAULT_PROFILE_PHOTO_SRC } from '../../core/utils/constants';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-card.component.html',
  styleUrl: './blog-card.component.scss',
})
export class BlogCardComponent {
  @Input() blog!: Blog;
  default_profile_photo: string = DEFAULT_PROFILE_PHOTO_SRC;
}
