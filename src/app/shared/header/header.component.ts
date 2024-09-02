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
import { __values } from 'tslib';
import { User } from '../../core/interfaces/user';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  title: string = TITLE;
  login_route: string = SLASH + LOGIN_ROUTE;
  register_route: string = SLASH + REGISTER_ROUTE;
  profile_route: string = SLASH + PROFILE_ROUTE;
  userName: string | undefined = undefined;
  currentPage: string = '';
  isLoggedin: boolean = false;
  userSubcription: Subscription | null = null;

  private prevRouteService = inject(PreviousRouteService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.isLoggedin = this.authService.isLoggedIn();
    this.userSubcription = this.authService.user$.subscribe(
      
    );
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
    this.userSubcription?.unsubscribe;
  }
}
