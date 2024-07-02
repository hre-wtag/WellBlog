import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
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
  uploadedFileName: string | null = null;
  tagList: Tag[] = [
    { title: 'Technology', isChecked: false },
    { title: 'Poetry', isChecked: false },
    { title: 'Films', isChecked: false },
    { title: 'Fiction', isChecked: false },
    { title: 'World Politics', isChecked: false },
  ];
  selectedTags: Tag[] = [];
  constructor() {
    this.addBlogForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ]),
      tags: new FormControl('', Validators.required),
      fileUpload: new FormControl('', Validators.required),
      blogBody: new FormControl('', Validators.required),
    });
  }
  getFormControl = (formGroup: FormGroup, formControlName: string) => {
    return formGroup.get(formControlName) as FormControl;
  };
  onSubmit(): void {
    console.log('Submitted');
  }
  onCancel(): void {
    console.log('Cancelled');
  }
  handleImageFileChange(event: Event): void {
    const imageFile = (<HTMLInputElement>event.target)?.files;
    if (imageFile) {
      console.log(imageFile[0], 'image');
      this.uploadedFileName = imageFile[0].name;
    }
  }

  onTouched(fieldName: string): void {
    const control = this.addBlogForm.get(fieldName);
    if (control) {
      control.markAsTouched();
    }
  }
  onCheckboxClick(title: string, isChecked: boolean): void {
    if (!isChecked) {
      this.selectedTags.push({ title, isChecked });
    }
    console.log(this.selectedTags);
    for (let sTag of this.selectedTags) {
      console.log(sTag);
    }
  }
  removeSelectedTag(selectedTag: Tag): void {
    // const index = this.selectedTags.indexOf(selectedTag);
    // if (index > -1) {
    //   this.selectedTags.splice(index, 1);
    // }
  }
}
