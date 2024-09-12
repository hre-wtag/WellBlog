import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../core/services/blog.service';
import { Blog } from '../../core/interfaces/blog';
import { DEFAULT_PROFILE_PHOTO_SRC } from '../../core/utils/constants';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { TooltipDirective } from '../../shared/Directives/tooltip.directive';
import { AddBlogComponent } from '../user-profile/add-blog/add-blog.component';
import DOMPurify from 'dompurify';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [
    CommonModule,
    TooltipDirective,
    AddBlogComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent implements OnInit, AfterViewInit {
  @ViewChild('blogDescription') blogDescription!: ElementRef;

  blog: Blog | null = null;
  default_profile_photo: string = DEFAULT_PROFILE_PHOTO_SRC;
  clickedBTN: string | null = null;
  isMyBlog: boolean = false;
  isLoading: boolean = true;

  private activatedRoute = inject(ActivatedRoute);
  private blogService = inject(BlogService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private titleService = inject(Title);
  blogUpdated: boolean = false;
  loadingDesc: boolean = true;
  ngOnInit(): void {
    this.loadBlog();
  }

  ngAfterViewInit(): void {
    this.loadDescription();
  }

  loadDescription(): void {
    if (this.blogDescription && this.blog) {
      const sanitizedDescription = DOMPurify.sanitize(this.blog.description);
      this.blogDescription.nativeElement.innerHTML = sanitizedDescription;
      this.loadingDesc = false;
    }
  }
  loadBlog(): void {
    const routeSubscription = this.activatedRoute.paramMap.subscribe({
      next: (paramMap) => {
        const blogId: number = Number(paramMap.get('id'));
        const blogSubcription = this.blogService
          .getSingleBlog(blogId)
          .subscribe((blog: Blog | null) => {
            this.blog = blog ?? null;

            if (this.blog === null) {
              this.router.navigate(['']);
            } else {
              this.isLoading = false;
              this.titleService.setTitle(this.blog.title);

              setTimeout(() => {
                this.loadDescription();
              }, 1000);
              this.isMyBlog = this.blogService.isMyBlog(this.blog?.bloggerid);
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
    const blogSubcription = this.blogService.blog$.subscribe(
      (blog: Blog | null) => {
        this.blog = blog ?? null;
        if (this.blog === null) {
          this.router.navigate(['']);
        } else {
          this.titleService.setTitle(this.blog.title);
          setTimeout(() => {
            this.loadDescription();
          }, 50);
          this.isMyBlog = this.blogService.isMyBlog(this.blog?.bloggerid);
        }
      }
    );
    this.destroyRef.onDestroy(() => blogSubcription.unsubscribe());
  }
}
