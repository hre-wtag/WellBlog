import { Component, inject } from '@angular/core';
import { TITLE, LOGIN_ROUTE, REGISTER_ROUTE } from '../../core/utils/constants';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PreviousRouteService } from '../../core/services/previous-route.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  title: string = TITLE;
  login_route: string = LOGIN_ROUTE;
  register_route: string = REGISTER_ROUTE;
  isLoggedin: boolean = false;
  userName: string | undefined = undefined;
  insideRegister: boolean = false;
  insideLogin: boolean = false;
  private prevRouteService = inject(PreviousRouteService);
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.isLoggedin = this.authService.isLoggedIn();
    if (this.isLoggedin) {
      this.userName = this.authService.getLoggedInUser()?.username;
    }
    if (this.router.url === this.register_route.toString()) {
      this.insideRegister = true;
    }
    if (this.router.url === this.login_route.toString()) {
      this.insideLogin = true;
    }
  }

  logout(): void {
    this.authService.removeLoggedInUser();
    this.router.navigate([this.login_route]);
  }
}
