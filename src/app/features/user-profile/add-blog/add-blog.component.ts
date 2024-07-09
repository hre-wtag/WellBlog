import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToasterService } from '../../../core/services/toaster.service';
import { Blog } from '../../../core/interfaces/blog';
import { BlogService } from '../../../core/services/blog.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
export interface Tag {
  title: string;
  isChecked: boolean;
}
@Component({
  selector: 'app-add-blog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-blog.component.html',
  styleUrl: './add-blog.component.scss',
})
export class AddBlogComponent implements OnInit, OnDestroy {
  addBlogForm: FormGroup;
  errorMsg: string | null = null;
  uploadedImageName: string | null = null;
  uploadedImage: File | null = null;
  nothingIsChecked: boolean = false;
  showDropdown: boolean = false;
  tagList: Tag[] = [
    { title: 'Technology', isChecked: false },
    { title: 'Poetry', isChecked: false },
    { title: 'Films', isChecked: false },
    { title: 'Fiction', isChecked: false },
    { title: 'World Politics', isChecked: false },
  ];

  private toasterService = inject(ToasterService);
  private blogService = inject(BlogService);
  private authService = inject(AuthService);
  private blogSubcription: Subscription | null = null;
  maxBlogId: number = 0;
  constructor() {
    this.addBlogForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      blogBody: new FormControl('', Validators.required),
    });
  }
  ngOnInit(): void {
    this.blogSubcription = this.blogService.blogs$.subscribe(
      (blogs: Blog[] | null) => {
        this.maxBlogId =
          blogs?.reduce((maxId, blog) => Math.max(maxId, blog?.id || 0), 0) ??
          0;
      }
    );
  }

  ngOnDestroy(): void {
    this.blogSubcription?.unsubscribe();
  }

  removeWhiteSpaces(event: Event) {
    console.log('asbhijhadjs');
    
    const trimmedValue = (event.target as HTMLInputElement).value.trim();
    (event.target as HTMLInputElement).value = trimmedValue;
  }

  onSubmit(): void {
    if (this.addBlogForm.invalid) {
      return;
    }
    const user = this.authService.user$.getValue();
    let bloggerName;
    let bloggerImagePath;
    if (user) {
      bloggerName = user.firstName?.concat(' ', user.lastName);
      bloggerImagePath = user.profileImagePath;
    }
    const blogId = this.blogService.blogs$.getValue();
    const blog: Blog = {
      ...this.addBlogForm.value,
      tags: [],
      blogImage: '',
      postingDate: Date(),
      bloggerName: bloggerName,
      bloggerImagePath: bloggerImagePath,
      bloggerId: user?.id,
      id: this.maxBlogId + 1,
    };
    const blogTags = this.tagList
      .filter((tag) => tag.isChecked)
      .map((tag) => tag.title);
    if (!blogTags.length) {
      this.toasterService.warning('Invalid!', 'Select at least one tag.');
      setTimeout(() => {
        this.toasterService.toasterInfo$.next(null);
      }, 4000);
      return;
    }
    if (this.uploadedImage === null) {
      this.toasterService.warning('Invalid!', 'Upload an Image.');
      setTimeout(() => {
        this.toasterService.toasterInfo$.next(null);
      }, 4000);
      return;
    }
    blog.tags.push(...blogTags);
    blog.blogImage = this.uploadedImage;
    this.blogService.blogs$.next([
      ...(this.blogService.blogs$.getValue() ?? []),
      blog,
    ]);
    this.clearForm();
  }

  onCancel(): void {
    this.clearForm();
  }
  clearForm(): void {
    this.addBlogForm.reset();
    for (let i = 0; i < this.tagList.length; i++) {
      this.tagList[i].isChecked = false;
    }
    this.nothingIsChecked = false;
    this.showDropdown = false;
    this.uploadedImage = null;
    this.uploadedImageName = null;
  }
  onTouched(fieldName: string): void {
    const control = this.addBlogForm.get(fieldName);
    if (control) {
      control.markAsTouched();
    }
  }
  onCheckboxClick(title: string, isChecked: boolean): void {
    const existingTagIndex = this.tagList.findIndex(
      (tag) => tag.title === title
    );

    if (existingTagIndex > -1) {
      this.tagList[existingTagIndex].isChecked = isChecked;
    }
    this.nothingIsChecked = this.tagList.some((tag) => tag.isChecked);
    if (!this.nothingIsChecked) {
      this.checkDropdown(false);
    }
  }

  checkDropdown(flag: boolean): void {
    this.showDropdown = flag;
  }

  handleImageFileChange(event: Event): void {
    event.preventDefault();
    const imageFile = (<HTMLInputElement>event.target)?.files;
    if (imageFile) {
      this.uploadedImageName = imageFile[0].name;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedImage = e.target.result;
      };
      reader.readAsDataURL(imageFile[0]);
    }
  }
  dropHandler(ev: DragEvent) {
    ev.preventDefault();
    if (ev.dataTransfer?.items) {
      const files = Array.from(ev.dataTransfer.items);
      for (let i = 0; i < files.length; i++) {
        const item = files[i];
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (this.validateFileType(file?.type)) {
            this.uploadedImageName = file?.name ? file?.name : null;
            const reader = new FileReader();
            reader.onload = (e: any) => {
              this.uploadedImage = e.target.result;
            };
            reader.readAsDataURL(file as Blob);
            break;
          } else {
            this.toasterService.warning(
              'Invalid!',
              'Only jpeg, jgp, & png images are allowed.'
            );
            setTimeout(() => {
              this.toasterService.toasterInfo$.next(null);
            }, 5000);
          }
        }
      }
    }
  }

  validateFileType(fileType: string | undefined): boolean | null {
    if (fileType) {
      const allowedTypes: string[] | undefined = [
        'image/jpeg',
        'image/jpg',
        'image/png',
      ];
      return allowedTypes.includes(fileType);
    }
    return null;
  }
  dragOver(event: Event) {
    event.preventDefault();
  }
}
