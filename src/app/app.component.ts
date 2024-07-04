import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TITLE } from './core/utils/constants';
import { HeaderComponent } from './shared/header/header.component';
import { ToasterComponent } from './shared/toaster/toaster.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ToasterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title: string = TITLE;
}
