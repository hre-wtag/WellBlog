import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { AddBlogComponent } from './add-blog/add-blog.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [HeaderComponent, UserInfoComponent, AddBlogComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent {
  clickedAddBlog: boolean = false;
}
