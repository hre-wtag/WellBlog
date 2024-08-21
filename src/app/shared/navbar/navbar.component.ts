import { Component, OnDestroy, OnInit, inject } from '@angular/core';
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
import { Subscription, filter, map } from 'rxjs';
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
  isLoggedin: boolean = false;
  showTooltip: boolean = false;
  userName: string | undefined = undefined;
  currentPage: string = '';
  private prevRouteService = inject(PreviousRouteService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private activatedRoute = inject(ActivatedRoute);
  private sharedService = inject(SharedService);
  userSubcription: Subscription | null = null;
  searchForm: FormGroup;
  constructor() {
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
    this.searchForm = new FormGroup({
      searchField: new FormControl(''),
    });
  }
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
  }

  logout(): void {
    this.authService.removeLoggedInUser();
    this.router.navigate([this.login_route]);
  }
  ngOnDestroy(): void {
    this.userSubcription?.unsubscribe();
  }
  searchBlog(): void {
    const str = this.searchForm.get('searchField')?.value.trim();
    this.sharedService.blogSearch(str);
  }
}