import { Component, inject } from '@angular/core';
import {
  TITLE,
  LOGIN_ROUTE,
  REGISTER_ROUTE,
  PROFILE_ROUTE,
} from '../../core/utils/constants';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  UrlSegment,
} from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PreviousRouteService } from '../../core/services/previous-route.service';
import { filter, map } from 'rxjs';
import { __values } from 'tslib';

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
    // this.router.events
    //   .pipe(
    //     filter((event) => event instanceof NavigationEnd),
    //     map(() => this.activatedRoute),
    //     map((route: ActivatedRoute) => {
    //       let currentRoute = route;
    //       while (currentRoute.firstChild) {
    //         currentRoute = currentRoute.firstChild;
    //       }
    //       return currentRoute;
    //     })
    //   )
    //   .subscribe({
    //     next: (route: ActivatedRoute) => {
    //       console.log('Current route url:', route.url);
    //       route.url.subscribe({
    //         next: (urlSegment: UrlSegment[]) => {
    //           console.log(urlSegment[0].path);
    //         },
    //       });
    //     },
    //   });
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        // map((route) => route.firstChild?.snapshot?.url[0].path),
        map((route) =>
          route.firstChild?.snapshot?.url[0]
            ? route.firstChild?.snapshot?.url[0].path
            : ''
        )
      )
      .subscribe({
        next: (path) => {
          console.log('Current path:', path, 'aijbhsipfjb');
        },
      });
  }

  logout(): void {
    this.authService.removeLoggedInUser();
    this.router.navigate([this.login_route]);
  }
}
