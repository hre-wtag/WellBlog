import { Injectable, inject } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PreviousRouteService {
  currURL: string = '';
  prevURL: string = '';
  tempURl: string = '';
  private router = inject(Router);
  constructor() {
    this.tempURl = window.location.href.split('4200')[1];
    this.prevURL = localStorage.getItem('prevURL') || this.tempURl;
    this.currURL = localStorage.getItem('currURL') || this.tempURl;
    this.prevURL = this.currURL;
    this.currURL = this.tempURl;
    this.tempURl = '';
    localStorage.setItem('prevURL', this.prevURL);
    localStorage.setItem('currURL', this.currURL);
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationStart => event instanceof NavigationStart
        )
      )
      .subscribe((event: NavigationStart) => {
        this.currURL = event.url;
        localStorage.setItem('prevURL', this.prevURL);
        localStorage.setItem('currURL', this.currURL);
        this.prevURL = this.currURL;
      });
  }

  getPreviousUrl(): string {
    const prevUrlStr = localStorage.getItem('prevURL');
    if (prevUrlStr) {
      return prevUrlStr.toString();
    }
    return '/';
  }
}
