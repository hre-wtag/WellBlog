import { Component, inject } from '@angular/core';
import {
  TITLE,
  LOGIN_ROUTE,
  REGISTER_ROUTE,
  PROFILE_ROUTE,
} from '../../core/utils/constants';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  profile_route: string = PROFILE_ROUTE;
  isLoggedin: boolean = false;
  userName: string | undefined = undefined;
  currentPage: string = '';
  private prevRouteService = inject(PreviousRouteService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private activatedRoute = inject(ActivatedRoute);
  ngOnInit(): void {
    this.isLoggedin = this.authService.isLoggedIn();
    if (this.isLoggedin) {
      this.userName = this.authService.getLoggedInUser()?.username;
    }
    this.currentPage = this.router.url;

    this.activatedRoute.url.subscribe((urlSegments) => {
      this.currentPage = urlSegments[0].path;
      console.log(this.currentPage, 'using router url');
    });
  }
  logout(): void {
    this.authService.removeLoggedInUser();
    this.router.navigate([this.login_route]);
  }
}
