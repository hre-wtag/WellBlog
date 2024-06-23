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
    this.currURL = this.router.url;

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationStart => event instanceof NavigationStart
        )
      )
      .subscribe((event: NavigationStart) => {
        this.prevURL = this.currURL;
        this.currURL = event.url;
        localStorage.setItem('prevURL', this.prevURL);
        localStorage.setItem('currURL', this.currURL);
        console.log(this.prevURL + ' prev', this.currURL + ' curr');
      });
  }
}
