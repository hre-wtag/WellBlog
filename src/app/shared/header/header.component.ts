import { Component, OnInit } from '@angular/core';
import { TITLE, LOGIN_ROUTE, REGISTER_ROUTE } from '../../core/utils/constants';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  title: string = TITLE;
  login_route: string = LOGIN_ROUTE;
  register_route: string = REGISTER_ROUTE;
  isLoggedin: boolean = false;
  userName: string = '';
  insideRegister: boolean = false;
  insideLogin: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit() {
    this.isLoggedin = this.authService.getLoginStatus();
    if (this.isLoggedin) {
      this.userName = this.authService.getUserData().username;
    }
    if (this.router.url === this.register_route.toString()) {
      this.insideRegister = true;
    }
    if (this.router.url === this.login_route.toString()) {
      this.insideLogin = true;
    }
  }
  logout() {
    this.authService.removeUserAuth();
    this.router.navigate([this.login_route]);
  }
}
