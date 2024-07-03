import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  toasterStatus$ = new BehaviorSubject<boolean | null>(null);

  showToast(flag: boolean): void {
    this.toasterStatus$.next(flag);
    console.log(flag, 't s');
  }

}
