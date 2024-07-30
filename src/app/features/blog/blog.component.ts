import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../core/services/blog.service';
import { Blog } from '../../core/interfaces/blog';
import { map } from 'rxjs';
import { DEFAULT_PROFILE_PHOTO_SRC } from '../../core/utils/constants';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { TooltipDirective } from '../../shared/Directives/tooltip.directive';
import { AddBlogComponent } from '../user-profile/add-blog/add-blog.component';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, TooltipDirective, AddBlogComponent],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private blogService = inject(BlogService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private titleService = inject(Title);
  blog: Blog | null = null;
  default_profile_photo: string = DEFAULT_PROFILE_PHOTO_SRC;
  isMyBlog: boolean = false;
  clickedBTN: string | null = null;
  ngOnInit(): void {
    this.loadBlog();
  }
  loadBlog(): void {
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
            } else {
              this.titleService.setTitle(this.blog.title);
              console.log(this.blog);
              this.isMyBlog = this.blogService.isMyBlog(this.blog?.bloggerId);
            }
          });
        this.destroyRef.onDestroy(() => blogSubcription.unsubscribe());
      },
    });
    this.destroyRef.onDestroy(() => routeSubscription.unsubscribe());
  }
  clickedHeaderBTN(btn: string): void {
    this.clickedBTN = btn;
  }
  handleAddFormSubmitted(formSubmitted: string | null): void {
    this.clickedBTN = formSubmitted;

  }
}
