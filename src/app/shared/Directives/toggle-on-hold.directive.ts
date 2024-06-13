import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appToggleOnHold]',
  standalone: true,
})
export class ToggleOnHoldDirective {
  private isHolding = false;
  private timeoutHandle: any;
  @Output() hold = new EventEmitter<boolean>(); // Output event for hold state

  constructor(private el: ElementRef) {}

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
    clearTimeout(this.timeoutHandle);
    this.hold.emit(false);
  }
}
