import {
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
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
import { Observable, Subscription, filter, of, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  currentPage: string = '';
  isLoggedin: boolean = false;
  showTooltip: boolean = false;
  usernameTooltip: boolean = false;
  loginTooltip: boolean = false;
  userName: string | undefined = undefined;
  userSubcription: Subscription | null = null;

  private prevRouteService = inject(PreviousRouteService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.isLoggedin = this.authService.isLoggedIn();
    this.userSubcription = this.authService.user$.subscribe({
      next: (user: User | null) => {
        if (user) {
          this.isLoggedin = true;
          this.userName = user?.username;
        } else {
          this.isLoggedin = false;
        }
      },
      error: (err: Error) => {
        console.error(err);
      },
    });
    this.router.events
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((event) => event instanceof NavigationEnd),
        switchMap(() => this.getPathFromRoute())
      )
      .subscribe({
        next: (path: string) => {
          this.currentPage = path ? '/' + path : '';
        },
        error: (error: Error) => {
          console.error('Error fetching path:', error);
        },
      });
  }

  getPathFromRoute(): Observable<string> {
    return of(
      this.activatedRoute.firstChild?.snapshot?.url[0]
        ? this.activatedRoute.firstChild?.snapshot?.url[0].path
        : ''
    );
  }
  logout(): void {
    this.authService.removeLoggedInUser();
    this.router.navigate([this.login_route]);
  }

  ngOnDestroy(): void {
    this.userSubcription?.unsubscribe();
  }

  changeTooltipFlag(flag: boolean, src: string): void {
    this.loginTooltip = false;
    this.usernameTooltip = false;
    if (src === 'username') {
      this.usernameTooltip = flag;
    }
    if (src === 'logout') {
      this.loginTooltip = flag;
    }
  }
}
