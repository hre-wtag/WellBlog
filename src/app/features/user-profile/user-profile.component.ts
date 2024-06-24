import { Component } from '@angular/core';
import { UserInfoComponent } from '../user-info/user-info.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [UserInfoComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {

}
