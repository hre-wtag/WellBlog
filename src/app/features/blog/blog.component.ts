import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../core/services/blog.service';
import { Blog } from '../../core/interfaces/blog';
import { map } from 'rxjs';

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
  private destroyRef = inject(DestroyRef);
  blog: Blog | null = null;
  ngOnInit(): void {
    console.log(this.activatedRoute);
    const routeSubscription = this.activatedRoute.paramMap.subscribe({
      next: (paramMap) => {
        const blogID = paramMap.get('id');
        const blogSubcription = this.blogService.blogs$
          .pipe(
            map((arr) =>
              arr?.filter((blog: Blog) => blog.id.toString() === blogID)
            )
          )
          .subscribe((blogs) => {
            this.blog = blogs?.[0] ?? null;
            console.log(this.blog, 'blog');
          });
        this.destroyRef.onDestroy(() => blogSubcription.unsubscribe());
      },
    });
    this.destroyRef.onDestroy(() => routeSubscription.unsubscribe());
  }
}
