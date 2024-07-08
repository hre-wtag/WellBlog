import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToasterService } from '../../../core/services/toaster.service';
import { Blog } from '../../../core/interfaces/blog';
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
export class AddBlogComponent {
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
  blogList: Blog[] = [];
  private toasterService = inject(ToasterService);
  constructor() {
    this.addBlogForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ]),
      blogBody: new FormControl('', Validators.required),
    });
  }

  onSubmit(): void {
    if (this.addBlogForm.invalid) {
      return;
    }
    const blog: Blog = { ...this.addBlogForm.value, tags: [], blogImage: '' };
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
    this.blogList.push(blog);
    console.log(this.blogList, 'blogs');
    this.clearForm();
  }
  onCancel(): void {
    this.clearForm();
  }
  clearForm() {
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
      this.uploadedImage = imageFile[0];
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
            this.uploadedImage = file;
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
