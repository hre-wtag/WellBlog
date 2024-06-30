import { Component, OnInit } from '@angular/core';
import { DEFAULT_PROFILE_PHOTO_SRC } from '../../../core/utils/constants';
import { User } from '../../../core/interfaces/user';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss',
})
export class UserInfoComponent implements OnInit {
  default_profile_photo = DEFAULT_PROFILE_PHOTO_SRC;
  userInfo!: User;
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.userInfo = this.authService.getLoggedInUser();
  }
}
