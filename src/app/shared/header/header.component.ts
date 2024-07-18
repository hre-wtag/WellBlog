import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  TITLE,
  LOGIN_ROUTE,
  REGISTER_ROUTE,
  PROFILE_ROUTE,
  SLASH,
} from '../../core/utils/constants';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PreviousRouteService } from '../../core/services/previous-route.service';
import { Subscription, filter, map } from 'rxjs';
import { __values } from 'tslib';
import { User } from '../../core/interfaces/user';
import { TooltipDirective } from '../Directives/tooltip.directive';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, TooltipDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  title: string = TITLE;
  login_route: string = SLASH + LOGIN_ROUTE;
  register_route: string = SLASH + REGISTER_ROUTE;
  profile_route: string = SLASH + PROFILE_ROUTE;
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
          this.isLoggedin = true;
          this.userName = user?.username;
        } else {
          this.isLoggedin = false;
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
    this.userSubcription?.unsubscribe();
  }
}
