import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
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
import { SharedService } from '../../../core/services/shared.service';

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
  @Input() editedBlog!: Blog;
  @Output() formSubmitted = new EventEmitter<string | null>();

  blogForm: FormGroup;
  errorMsg: string | null = null;
  uploadedImageName: string | null = null;
  uploadedImage: File | null = null;
  hasTag: boolean = false;
  showDropdown: boolean = false;
  isSingleClick: boolean = true;
  isEditing: boolean = false;
  tagList: Tag[] = [
    { title: 'Technology fdfadsasASDASASASDDSAADSDSADSAS', isChecked: false },
    { title: 'Poetry', isChecked: false },
    { title: 'Films', isChecked: false },
    { title: 'Fiction', isChecked: false },
    { title: 'Adventure', isChecked: false },
    { title: 'Tourism', isChecked: false },
    { title: 'Nature', isChecked: false },
  ];
  selectedTags: string[] = [];
  tinyAPIKey: string = TINYMCE_API_KEY;
  init: EditorComponent['init'] = {
    plugins: 'emoticons link lists advlist preview',
    toolbar:
      'fontfamily fontsize |  bold italic underline  forecolor backcolor emoticons link |  numlist bullist lists advlist |  indent outdent removeformat preview',
    advlist_number_styles:
      'default lower-alpha lower-greek lower-roman upper-alpha upper-roman',
    advlist_bullet_styles: 'default circle disc square',
    height: 600,
    statusbar: false,
    resize: false,
    menubar: false,
    content_css: 'src/styles.scss',
    setup: (editor) => {
      editor.setContent('This is the initial text');
    },
  };
  private toasterService = inject(ToasterService);
  private blogService = inject(BlogService);
  private authService = inject(AuthService);
  private htmlTOTextService = inject(HtmlToTextService);
  private sharedService = inject(SharedService);
  private blogSubcription: Subscription | null = null;

  constructor() {
    this.blogForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.maxLength(250),
      ]),
      description: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    if (this.editedBlog) {
      this.isEditing = true;
      this.setBlogValues(this.editedBlog);
    }
  }

  setBlogValues(blog: Blog): void {
    this.blogForm.patchValue({
      title: blog.title,
      description: blog.description,
    });
    this.selectedTags = blog.tags;
    this.hasTag = true;
    this.selectedTags.forEach((tag: string) => {
      const foundTag = this.tagList.find((t) => t.title === tag);
      if (foundTag) {
        foundTag.isChecked = true;
      }
    });
  }

  removeWhiteSpaces(event: Event) {
    const trimmedValue = (event.target as HTMLInputElement).value.trim();
    (event.target as HTMLInputElement).value = trimmedValue;
  }

  onSubmit(): void {
    if (this.blogForm.invalid) {
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

    const convertedText = this.htmlTOTextService.htmlToText(
      this.blogForm.get('description')?.value
    );
    if (convertedText.trim() === '') {
      this.toasterService.warning('Invalid!', 'Must add blog Description.');
      setTimeout(() => {
        this.toasterService.toasterInfo$.next(null);
      }, 4000);
      return;
    }
    if (!this.isEditing) {
      if (this.uploadedImage === null) {
        this.toasterService.warning('Invalid!', 'Must upload an Image.');
        setTimeout(() => {
          this.toasterService.toasterInfo$.next(null);
        }, 4000);
        return;
      }
      this.addBlog(blogTags);
    } else {
      this.editBLog(blogTags);
    }
    this.formSubmitted.emit(null);
    this.clearForm();
  }

  editBLog(blogTags: string[]): void {
    const blog: Blog = {
      ...this.blogForm.value,
      tags: [],
      blogImage: '',
      bloggerId: this.editedBlog.bloggerId,
      bloggerImage: this.editedBlog.bloggerImage,
      bloggerName: this.editedBlog.bloggerName,
      id: this.editedBlog.id,
      postingDate: this.editedBlog.postingDate,
    };
    blog.tags.push(...blogTags);
    blog.blogImage =
      this.uploadedImage != null
        ? this.uploadedImage
        : this.editedBlog.blogImage;
    const blogUpdated = this.blogService.updateBlog(blog);
    if (blogUpdated) {
      this.toasterService.success('Success!', 'The blog is updated.');
      setTimeout(() => {
        this.toasterService.toasterInfo$.next(null);
      }, 4000);
    } else {
      this.toasterService.error('Error!', 'Unable to update the blog.');
      setTimeout(() => {
        this.toasterService.toasterInfo$.next(null);
      }, 4000);
    }
  }

  addBlog(blogTags: string[]): void {
    const user = this.authService.user$.getValue();
    let bloggerName;
    let bloggerImage;
    if (user) {
      bloggerName = user.firstName?.concat(' ', user.lastName);
      bloggerImage = user.profileImage;
    }
    let maxBlogId;
    this.blogSubcription = this.blogService.blogs$.subscribe(
      (blogs: Blog[] | null) => {
        maxBlogId = blogs?.reduce(
          (maxId, blog) => Math.max(maxId, blog?.id || 0),
          0
        );
      }
    );
    const blog: Blog = {
      ...this.blogForm.value,
      tags: [],
      blogImage: '',
      postingDate: Date(),
      bloggerName: bloggerName,
      bloggerImage: bloggerImage,
      bloggerId: user?.id,
      id: maxBlogId ? maxBlogId + 1 : 1,
    };
    blog.tags.push(...blogTags);
    if (this.uploadedImage != null) {
      blog.blogImage = this.uploadedImage;
    }
    const blogAdded = this.blogService.addBlog(blog);
    if (blogAdded) {
      this.toasterService.success('Success!', 'The blog is added.');
      setTimeout(() => {
        this.toasterService.toasterInfo$.next(null);
      }, 4000);
    } else {
      this.toasterService.error('Error!', 'Unable to add the blog.');
      setTimeout(() => {
        this.toasterService.toasterInfo$.next(null);
      }, 4000);
    }
  }

  onCancel(): void {
    this.formSubmitted.emit(null);
    this.clearForm();
  }

  clearForm(): void {
    this.blogForm.reset();
    for (let i = 0; i < this.tagList.length; i++) {
      this.tagList[i].isChecked = false;
    }
    this.hasTag = false;
    this.showDropdown = false;
    this.uploadedImage = null;
    this.uploadedImageName = null;
  }

  ngOnDestroy(): void {
    this.blogSubcription?.unsubscribe();
  }

  onCheckboxDoubleClick(title: string, isChecked: boolean): void {
    this.changeTagFlag(title, isChecked);
    this.isSingleClick = false;
    this.showDropdown = false;
  }

  onCheckboxClick(title: string, isChecked: boolean): void {
    this.isSingleClick = true;
    setTimeout(() => {
      if (this.isSingleClick) {
        this.changeTagFlag(title, isChecked);
      }
    }, 300);
  }

  changeTagFlag(title: string, isChecked: boolean): void {
    const existingTagIndex = this.tagList.findIndex(
      (tag) => tag.title === title
    );
    if (existingTagIndex > -1) {
      this.tagList[existingTagIndex].isChecked = isChecked;
    }
    this.hasTag = this.tagList.some((tag) => tag.isChecked);
    if (!this.hasTag) {
      this.checkDropdown(false);
    }
    if (isChecked) this.selectedTags.push(title);
    else {
      this.selectedTags = this.selectedTags.filter((item) => item != title);
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

  dropHandler(ev: DragEvent): void {
    ev.preventDefault();
    const imageFile = this.sharedService.imageDropHandler(ev);
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedImageName = imageFile.name ?? null;
        this.uploadedImage = e.target.result;
      };
      reader.readAsDataURL(imageFile as Blob);
    }
  }

  dragOver(event: Event) {
    event.preventDefault();
  }
}
