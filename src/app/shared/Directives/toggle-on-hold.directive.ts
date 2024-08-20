import {
  Directive,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appToggleOnHold]',
  standalone: true,
})
export class ToggleOnHoldDirective implements OnChanges {
  @Input() flag!: string | 'showPassowrd' | 'hidePassword';
  @Output() hold = new EventEmitter<boolean>();

  ngOnChanges(): void {
    if (this.flag === 'showPassowrd') {
      this.hold.emit(true);
    } else {
      this.hold.emit(false);
    }
  }
}
