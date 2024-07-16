import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SharedService } from '../../../core/services/shared.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss',
})
export class EditUserComponent {
  @Output() formSubmitted = new EventEmitter<string | null>();
  editUserForm: FormGroup;
  private sharedService = inject(SharedService);
  uploadedImageName: string | null = null;
  uploadedImage: File | null = null;

  constructor() {
    this.editUserForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      about: new FormControl('', Validators.required),
    });
  }
  removeWhiteSpaces(event: Event) {
    const trimmedValue = (event.target as HTMLInputElement).value.trim();
    (event.target as HTMLInputElement).value = trimmedValue;
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
  onSubmit(): void {}
  onCancel(): void {
    this.formSubmitted.emit(null);
    this.clearForm();
  }
  clearForm(): void {
    this.editUserForm.reset();
    this.uploadedImage = null;
    this.uploadedImageName = null;
  }
}
