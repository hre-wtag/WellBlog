import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValidatorsService } from '../../../core/services/validators.service';

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
  private validatorService = inject(ValidatorsService);
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
}
