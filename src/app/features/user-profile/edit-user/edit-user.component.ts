import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SharedService } from '../../../core/services/shared.service';
import { DEFAULT_PROFILE_PHOTO_SRC } from '../../../core/utils/constants';
import { User } from '../../../core/interfaces/user';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss',
})
export class EditUserComponent implements OnInit {
  @Output() formSubmitted = new EventEmitter<string | null>();
  editUserForm: FormGroup;
  userInfo: User | null = null;
  private sharedService = inject(SharedService);
  private authService = inject(AuthService);
  uploadedImageName: string | null = null;
  uploadedImage: File | null = null;
  default_profile_photo: string = DEFAULT_PROFILE_PHOTO_SRC;

  constructor() {
    this.editUserForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      subtitle: new FormControl(''),
      about: new FormControl(''),
    });
  }
  ngOnInit(): void {
    this.authService.user$.subscribe((user: User | null) => {
      this.userInfo = user ?? null;
      console.log(this.userInfo);
      this.editUserForm.patchValue({
        firstName: this.userInfo?.firstName,
        lastName: this.userInfo?.lastName,
        subtitle: this.userInfo?.subtitle,
        about: this.userInfo?.about,
      });
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
  onSubmit(): void {
    if (this.editUserForm.invalid) {
      return;
    }

    const updatedUser = {
      ...this.userInfo,
      firstName: this.editUserForm.get('firstName')!.value,
      lastName: this.editUserForm.get('lastName')!.value,
      subtitle: this.editUserForm.get('subtitle')!.value ?? null,
      about: this.editUserForm.get('about')!.value ?? null,
      profileImage: this.uploadedImage,
    };
    console.log(updatedUser);
  }
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
