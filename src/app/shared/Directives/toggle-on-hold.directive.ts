import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appToggleOnHold]',
  standalone: true,
})
export class ToggleOnHoldDirective {
  private isHolding: boolean = false;
  @Output() hold = new EventEmitter<boolean>();

  @HostListener('mousedown')
  @HostListener('touchstart')
  onMouseDown() {
    this.isHolding = true;
    if (this.isHolding) {
      this.hold.emit(true);
    }
  }

  @HostListener('mouseup')
  @HostListener('mouseleave')
  @HostListener('touchend')
  onMouseUp() {
    this.isHolding = false;
    this.hold.emit(false);
  }
}
