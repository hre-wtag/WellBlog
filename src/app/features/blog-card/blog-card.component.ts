import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { Blog } from '../../core/interfaces/blog';
import {
  BLOG_ROUTE,
  DEFAULT_PROFILE_PHOTO_SRC,
  PROFILE_ROUTE,
  SLASH,
} from '../../core/utils/constants';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BlogService } from '../../core/services/blog.service';
import { ToasterService } from '../../core/services/toaster.service';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog-card.component.html',
  styleUrl: './blog-card.component.scss',
})
export class BlogCardComponent implements OnChanges {
  @Input() blog!: Blog;
  @Input() filteredTag: string = 'Nature';
  @Output() selectedFilterTag = new EventEmitter<string>();
  default_profile_photo: string = DEFAULT_PROFILE_PHOTO_SRC;
  blog_route: string = SLASH + BLOG_ROUTE;
  showDeleteBtn: boolean = false;
  profile_route: string = SLASH + PROFILE_ROUTE;
  private router = inject(Router);
  private blogService = inject(BlogService);
  private toasterService = inject(ToasterService);

  ngOnChanges(): void {
    this.showDeleteBtn = this.router.url === this.profile_route ? true : false;
  }

  onDelete(id: number): void {
    console.log('service',id);
    
    const blogDeleted = this.blogService.deleteBlog(id).subscribe({
      next: (response: boolean) => {
        if (response) {
          this.toasterService.success('Success!', 'Blog deleted successfully.');
          setTimeout(() => {
            this.toasterService.clear();
          }, 3000);
        }
      },
      error: () => {
        this.toasterService.error('Error!', 'Error deleting the blog!');
        setTimeout(() => {
          this.toasterService.clear();
        }, 3000);
      },
    });
    // if (blogDeleted) {
    //   this.toasterService.success('Success!', 'The blog is Deleted.');
    //   setTimeout(() => {
    //     this.toasterService.toasterInfo$.next(null);
    //   }, 4000);
    // } else {
    //   this.toasterService.error('Error!', 'Unable to delete the blog.');
    //   setTimeout(() => {
    //     this.toasterService.toasterInfo$.next(null);
    //   }, 4000);
    // }
  }
  onFilterTag(tag: string): void {
    this.selectedFilterTag.emit(tag);
  }
}
