import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
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
import { EditorComponent, EditorModule } from '@tinymce/tinymce-angular';
import { TINYMCE_API_KEY } from '../../../../environments/seretKeys';
import { HtmlToTextService } from '../../../core/services/html-to-text.service';

export interface Tag {
  title: string;
  isChecked: boolean;
}
@Component({
  selector: 'app-add-blog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EditorModule],
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
    { title: 'Adventure', isChecked: false },
    { title: 'Tourism', isChecked: false },
    { title: 'Nature', isChecked: false },
  ];
  tinyAPIKey: string = TINYMCE_API_KEY;
  init: EditorComponent['init'] = {
    plugins: 'emoticons link lists advlist preview',
    toolbar:
      'fontfamily fontsize |  bold italic underline  forecolor backcolor emoticons link |  numlist bullist lists advlist |  indent outdent removeformat preview',
    advlist_number_styles:
      'default lower-alpha lower-greek lower-roman upper-alpha upper-roman',
    advlist_bullet_styles: 'default circle disc square',
    statusbar: false,
    resize: false,
    menubar: false,
    content_css: 'src/styles.scss',
    // setup: (editor) => {
    //   editor.on('change', (e) => {
    //     console.log(e, 'keydown press detected');
    //   });
    // },
  };
  private toasterService = inject(ToasterService);
  private blogService = inject(BlogService);
  private authService = inject(AuthService);
  private htmlTOTextService = inject(HtmlToTextService);
  private blogSubcription: Subscription | null = null;
  maxBlogId: number = 0;

  constructor() {
    this.addBlogForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', Validators.required),
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
    const trimmedValue = (event.target as HTMLInputElement).value.trim();
    (event.target as HTMLInputElement).value = trimmedValue;
  }

  onSubmit(): void {
    if (this.addBlogForm.invalid) {
      return;
    }

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

    const convertedText = this.htmlTOTextService.htmlToText(
      this.addBlogForm.get('description')?.value
    );

    console.log(convertedText.trim(), 'trimmed value');
    if (convertedText.trim() === '') {
      this.toasterService.warning('Invalid!', 'Must add blog Description.');
      setTimeout(() => {
        this.toasterService.toasterInfo$.next(null);
      }, 4000);
      return;
    }
    const user = this.authService.user$.getValue();
    let bloggerName;
    let bloggerImagePath;
    if (user) {
      bloggerName = user.firstName?.concat(' ', user.lastName);
      bloggerImagePath = user.profileImagePath;
    }

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
