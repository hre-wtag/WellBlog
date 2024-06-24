import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appToggleOnHold]',
  standalone: true,
})
export class ToggleOnHoldDirective {
  private isHolding = false;
  @Output() hold = new EventEmitter<boolean>();

  @HostListener('mousedown')
  onMouseDown() {
    this.isHolding = true;
    if (this.isHolding) {
      this.hold.emit(true);
    }
  }

  @HostListener('mouseup')
  @HostListener('mouseleave')
  onMouseUp() {
    this.isHolding = false;
    this.hold.emit(false);
  }
}
