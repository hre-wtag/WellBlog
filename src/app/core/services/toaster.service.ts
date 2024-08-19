import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IToast } from '../../shared/toaster/toaster.component';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  toasterInfo$ = new BehaviorSubject<IToast | null>(null);

  showToast(toast: IToast): void {
    this.toasterInfo$.next(toast);
  }

  clear(): void {
    this.toasterInfo$.next(null);
  }

  success(title: string, msg: string): void {
    this.showToast({ type: 'success', title: title, msg: msg });
  }

  error(title: string, msg: string): void {
    this.showToast({ type: 'error', title: title, msg: msg });
  }

  warning(title: string, msg: string): void {
    this.showToast({ type: 'warning', title: title, msg: msg });
  }

  info(title: string, msg: string): void {
    this.showToast({ type: 'info', title: title, msg: msg });
  }
}
