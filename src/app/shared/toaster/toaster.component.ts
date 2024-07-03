import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toaster.component.html',
  styleUrl: './toaster.component.scss',
})
export class ToasterComponent implements OnInit {
  toastMessage = 'This is a toast';
  showsToast = true;
  ngOnInit(): void {
    console.log('toaster');

    this.showToastser();
  }
  showToastser(): void {
    this.showsToast = true;
    setTimeout(() => {
      this.closeToast();
    }, 3000);
  }
  closeToast(): void {
    this.showsToast = false;
  }
}
