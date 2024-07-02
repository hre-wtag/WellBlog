import { Component } from '@angular/core';
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
  nothingIsChecked: boolean = false;
  showDropdown: boolean = false;
  tagList: Tag[] = [
    { title: 'Technology', isChecked: false },
    { title: 'Poetry', isChecked: false },
    { title: 'Films', isChecked: false },
    { title: 'Fiction', isChecked: false },
    { title: 'World Politics', isChecked: false },
  ];
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
    const existingTagIndex = this.tagList.findIndex(
      (tag) => tag.title === title
    );

    if (existingTagIndex > -1) {
      this.tagList[existingTagIndex].isChecked = isChecked;
    }
    this.nothingIsChecked = this.tagList.some((tag) => tag.isChecked);
  }
  // onShowDropdown(flag: string): void {
  //   if (flag !== 'fromCrossTag' && !this.nothingIsChecked) {
  //     this.showDropdown = !this.showDropdown;
  //   }
  // }
  // handleClickOutside(event: Event) {
  //   if (this.showDropdown) {
  //     const dropdownElement = document.querySelector('.dropdown-menu.show');
  //     console.log(event.target, 'dropdownElement');
  //     if (
  //       !dropdownElement ||
  //       dropdownElement.isEqualNode(event.target as Node)
  //     ) {
  //       return;
  //     } else {
  //       this.showDropdown = false;
  //       console.log('hello world');
  //     }
  //   }
  //   return;
  // }

  checkDropdown(flag:boolean): void {
    console.log('click dp');
    this.showDropdown = flag;
  }
}
