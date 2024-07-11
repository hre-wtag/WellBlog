import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../core/services/blog.service';
import { Blog } from '../../core/interfaces/blog';
import { map } from 'rxjs';
import {
  DEFAULT_PROFILE_PHOTO_SRC,
  HOME_ROUTE,
} from '../../core/utils/constants';
import { CommonModule } from '@angular/common';
import { PreviousRouteService } from '../../core/services/previous-route.service';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private blogService = inject(BlogService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  blog: Blog | null = null;
  default_profile_photo: string = DEFAULT_PROFILE_PHOTO_SRC;
  ngOnInit(): void {
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
            if (this.blog === null) {
              this.router.navigate(['']);
            }
          });
        this.destroyRef.onDestroy(() => blogSubcription.unsubscribe());
      },
    });
    this.destroyRef.onDestroy(() => routeSubscription.unsubscribe());
  }
}
