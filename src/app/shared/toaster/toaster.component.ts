import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToasterService } from '../../core/services/toaster.service';
export interface IToast {
  title: string;
  type: 'error' | 'success' | 'warning';
  msg: string;
}
@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toaster.component.html',
  styleUrl: './toaster.component.scss',
})
export class ToasterComponent implements OnInit, OnDestroy {
  showsToast: boolean | null = null;
  toast: IToast | null = null;
  private toasterSubscription: Subscription | null = null;
  private toasterService = inject(ToasterService);

  ngOnInit(): void {
    this.toasterSubscription = this.toasterService.toasterInfo$.subscribe(
      (t: IToast | null) => {
        this.toast = t;
        console.log(t, 't toaster');
      }
    );
  }

  closeToast(): void {
    this.toasterService.toasterInfo$.next(null);
  }
  ngOnDestroy(): void {
    this.closeToast();
    this.toasterSubscription?.unsubscribe;
  }
}
