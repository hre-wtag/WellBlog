import { Injectable, inject } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PreviousRouteService {
  currURL: string = '';
  prevURL: string = '';
  router = inject(Router);

  constructor() {
    // Capture the initial URL before any navigation occurs
    this.currURL = this.router.url;

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationStart => event instanceof NavigationStart
        )
      )
      .subscribe((event: NavigationStart) => {
        // Update prevURL before navigation starts (captures the current URL)
        this.prevURL = this.currURL;
        this.currURL = event.url; // Update currURL to the upcoming URL
        console.log(this.prevURL + ' prev', this.currURL + ' curr');
      });
  }
}
