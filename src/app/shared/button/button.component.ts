import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() btnLabel!: string;
  @Input() btnType!: string;
  @Input() classes!: string;
  @Input() isDisabled!: boolean;
  @Output() clickEvent = new EventEmitter<Event>();

  onClicked(event: Event): void {
    this.clickEvent.emit(event);
  }
}
