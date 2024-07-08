import { Component } from '@angular/core';
import { UserInfoComponent } from './user-info/user-info.component';
import { AddBlogComponent } from './add-blog/add-blog.component';
import { BlogCardComponent } from '../blog-card/blog-card.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [UserInfoComponent, AddBlogComponent, BlogCardComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent {
  clickedAddBlog: boolean = false;
}
