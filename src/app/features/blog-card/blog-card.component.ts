import { Component, Input } from '@angular/core';
import { Blog } from '../../core/interfaces/blog';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [],
  templateUrl: './blog-card.component.html',
  styleUrl: './blog-card.component.scss',
})
export class BlogCardComponent {
  @Input() blog!: Blog;
}
