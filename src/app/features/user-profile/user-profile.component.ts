import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { UserInfoComponent } from './user-info/user-info.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [HeaderComponent,UserInfoComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {

}
