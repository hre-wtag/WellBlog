import {
  ComponentRef,
  Directive,
  ElementRef,
  Input,
  ViewContainerRef,
} from '@angular/core';
import { TooltipComponent } from '../tooltip/tooltip.component';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective {
  @Input() tooltipText = '';
  private tooltipComponentRef: ComponentRef<TooltipComponent> | null = null;

  constructor(
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef
  ) {}
  @Input() showTooltip: boolean = false;
  ngOnChanges() {
    console.log(this.showTooltip);
    if (this.showTooltip) {
      this.createTooltip();
    } else {
      this.destroyTooltip();
    }
  }
  createTooltip(): void {
    if (this.tooltipComponentRef) return;
    this.tooltipComponentRef =
      this.viewContainerRef.createComponent(TooltipComponent);
    this.tooltipComponentRef.instance.text = this.tooltipText;
    this.setTooltipPosition();
    this.tooltipComponentRef.hostView.detectChanges();
  }

  private setTooltipPosition(): void {
    if (!this.tooltipComponentRef) return;
    const { left, right, bottom } =
      this.elementRef.nativeElement.getBoundingClientRect();
    this.tooltipComponentRef.instance.left = (right - left) / 2 + left;
    this.tooltipComponentRef.instance.top = bottom ;
  }

  private destroyTooltip(): void {
    if (this.tooltipComponentRef) {
      this.tooltipComponentRef.destroy();
      this.tooltipComponentRef = null;
    }
  }
}
