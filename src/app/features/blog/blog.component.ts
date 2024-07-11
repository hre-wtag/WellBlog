import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../core/services/blog.service';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private blogService = inject(BlogService);

  ngOnInit(): void {
    console.log(this.activatedRoute);
    const routeSubscription = this.activatedRoute.paramMap.subscribe({
      next: (paramMap) => {
        console.log(paramMap.get('id'));
        this.blogService.blogs$.subscribe((blogs) => {
          console.log(blogs);
        });
      },
    });
  }
}
