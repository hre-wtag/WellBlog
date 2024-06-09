import { Component, OnInit } from '@angular/core';
import { TITLE, LOGIN_ROUTE, REGISTER_ROUTE } from '../../core/utils/constants';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  title = TITLE;
  login_route = LOGIN_ROUTE;
  register_route = REGISTER_ROUTE;
  ngOnInit() {
    console.log('Header Init!');
  }
}
