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
  BLOG_ROUTE,
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
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SharedService } from '../../core/services/shared.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, TooltipDirective, ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
  title: string = TITLE;
  login_route: string = SLASH + LOGIN_ROUTE;
  register_route: string = SLASH + REGISTER_ROUTE;
  profile_route: string = SLASH + PROFILE_ROUTE;
  blog_route: string = SLASH + BLOG_ROUTE;
  currentPage: string = '';
  isLoggedin: boolean = false;
  usernameTooltip: boolean = false;
  logoutTooltip: boolean = false;
  userName: string | undefined = undefined;
  userSubcription: Subscription | null = null;
  searchForm: FormGroup;

  private prevRouteService = inject(PreviousRouteService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private activatedRoute = inject(ActivatedRoute);
  private sharedService = inject(SharedService);
  private destroyRef = inject(DestroyRef);

  constructor() {
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

    this.searchForm = new FormGroup({
      searchField: new FormControl(''),
    });
  }
  
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
  }

  ngOnDestroy(): void {
    this.userSubcription?.unsubscribe();
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
    this.usernameTooltip = false;
    this.logoutTooltip = false;
    this.router.navigate([this.login_route]);
  }

  searchBlog(): void {
    const str = this.searchForm.get('searchField')?.value.trim();
    this.sharedService.blogSearch(str);
  }
}
