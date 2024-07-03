import { Component, OnDestroy, OnInit, inject } from '@angular/core';
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
import { Subscription, filter, map } from 'rxjs';
import { __values } from 'tslib';
import { User } from '../../core/interfaces/user';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
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
  userSubcription: Subscription | null = null;

  ngOnInit(): void {
    this.isLoggedin = this.authService.isLoggedIn();
    this.userSubcription = this.authService.user$.subscribe(
      (user: User | null) => {
        if (user) {
          this.userName = user?.username;
        }
      }
    );
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) =>
          route.firstChild?.snapshot?.url[0]
            ? route.firstChild?.snapshot?.url[0].path
            : ''
        )
      )
      .subscribe({
        next: (path) => {
          this.currentPage = path ? '/' + path : '';
        },
      });
  }

  logout(): void {
    this.authService.removeLoggedInUser();
    this.router.navigate([this.login_route]);
  }
  ngOnDestroy(): void {
    this.userSubcription?.unsubscribe;
  }
}
