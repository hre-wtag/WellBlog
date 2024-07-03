import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToasterService } from '../../core/services/toaster.service';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toaster.component.html',
  styleUrl: './toaster.component.scss',
})
export class ToasterComponent implements OnInit, OnDestroy {
  // @Input() showsToast!: boolean | null;
  showsToast: boolean | null = null;
  toastMessage = 'This is a toast';
  private toasterSubscription: Subscription | null = null;
  private toasterService = inject(ToasterService);

  ngOnInit(): void {
    this.toasterSubscription = this.toasterService.toasterStatus$.subscribe(
      (flag) => {
        this.showsToast = flag;
        console.log(flag);
      }
    );
  }

  closeToast(): void {
    this.showsToast = false;
  }
  ngOnDestroy(): void {
    this.closeToast();
    this.toasterSubscription?.unsubscribe;
  }
}
