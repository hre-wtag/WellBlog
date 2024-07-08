import { Component } from '@angular/core';
import { UserInfoComponent } from './user-info/user-info.component';
import { AddBlogComponent } from './add-blog/add-blog.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [UserInfoComponent, AddBlogComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent {
  clickedAddBlog: boolean = true;
}
