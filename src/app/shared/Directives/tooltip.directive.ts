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
  @Input() tooltipText!: string;
  @Input() showTooltip!: boolean;
  @Input() tooltipPosition!: 'top' | 'right' | 'bottom' | 'left';
  offset: number = 0;
  private tooltipComponentRef: ComponentRef<TooltipComponent> | null = null;

  constructor(
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnChanges() {
    console.log(this.showTooltip, this.tooltipPosition);
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

    this.tooltipComponentRef.instance.elementSize.subscribe((size) => {
      this.setTooltipPosition(size);
    });

    this.tooltipComponentRef.changeDetectorRef.detectChanges();
    this.tooltipComponentRef.hostView.detectChanges();
  }

  setTooltipPosition(size: { width: number; height: number }) {
    if (!this.tooltipComponentRef) return;
    const targetRect = this.elementRef.nativeElement.getBoundingClientRect();
    const tooltipElement = this.tooltipComponentRef?.location.nativeElement;
    const tooltipSize = tooltipElement.getBoundingClientRect();
    const tooltipRect = size;
    const scrollPos =
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    let top, left;

    if (this.tooltipPosition === 'top') {
      top = targetRect.top - tooltipRect.height - this.offset;
      left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
    }

    if (this.tooltipPosition === 'bottom') {
      top = targetRect.bottom + this.offset;
      left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
    }

    if (this.tooltipPosition === 'left') {
      top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
      left = targetRect.left - tooltipRect.width - this.offset;
    }

    if (this.tooltipPosition === 'right') {
      top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
      left = targetRect.right + this.offset;
    }
    this.tooltipComponentRef.instance.left = left;
    this.tooltipComponentRef.instance.top = top;
    console.log(targetRect, tooltipRect);
  }
  destroyTooltip(): void {
    if (this.tooltipComponentRef) {
      this.tooltipComponentRef.destroy();
      this.tooltipComponentRef = null;
    }
  }
}

