import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DEFAULT_PROFILE_PHOTO_SRC } from '../../../core/utils/constants';
import { User } from '../../../core/interfaces/user';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss',
})
export class UserInfoComponent implements OnInit, OnDestroy {
  userInfo!: User | null;
  userSubcription: Subscription | null = null;
  default_profile_photo: string = DEFAULT_PROFILE_PHOTO_SRC;

  private authService = inject(AuthService);

  ngOnInit(): void {
    this.userSubcription = this.authService.user$.subscribe({
      next: (user: User | null) => {
        this.userInfo = user;
      },
      error: (err: Error) => {
        console.error(err);
      },
    });
  }

  ngOnDestroy(): void {
    this.userSubcription?.unsubscribe();
  }
}
