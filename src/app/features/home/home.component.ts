import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { PreviousRouteService } from '../../core/services/previous-route.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  // constructor(private prevRouteService: PreviousRouteService) {}
  prevRouteService = inject(PreviousRouteService);
}
