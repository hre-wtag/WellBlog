import { Component } from '@angular/core';
import { InputComponent } from '../../../shared/input/input.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-add-blog',
  standalone: true,
  imports: [InputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './add-blog.component.html',
  styleUrl: './add-blog.component.scss',
})
export class AddBlogComponent {
  addBlogForm: FormGroup;
  constructor() {
    this.addBlogForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ]),
    });
  }
  getFormControl = (formGroup: FormGroup, formControlName: string) => {
    return formGroup.get(formControlName) as FormControl;
  };
  onSubmit(event: Event): void {
    console.log('Submitted');
  }
  onCancel(event: Event): void {
    console.log('Cancelled');
  }
  handleImageFileChange(event: FileList | null): void {
    console.log(event, 'image');
  }
}
