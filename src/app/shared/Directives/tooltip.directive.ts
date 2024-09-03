import {
  ComponentRef,
  Directive,
  ElementRef,
  inject,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
  ViewContainerRef,
} from '@angular/core';
import { TooltipComponent } from '../tooltip/tooltip.component';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnChanges {
  @Input() isSticked: boolean = false;
  @Input() showTooltip!: boolean;
  @Input() tooltipText!: string;

  @Input() tooltipPosition!: 'top' | 'right' | 'bottom' | 'left';
  offset: number = 7;

  private tooltipComponentRef: ComponentRef<TooltipComponent> | null = null;
  private elementRef = inject(ElementRef);
  private viewContainerRef = inject(ViewContainerRef);
  private renderer = inject(Renderer2);

  private scrollUnlistenFn: (() => void) | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showTooltip']) {
      console.log(this.showTooltip, 'show tooltip');
      if (this.showTooltip) this.createTooltip();
      else this.destroyTooltip();
    }
  }

  ngOnDestroy() {
    this.destroyTooltip();
  }

  createTooltip(): void {
    if (this.tooltipComponentRef) return;
    this.tooltipComponentRef =
      this.viewContainerRef.createComponent(TooltipComponent);
    this.tooltipComponentRef.instance.text = this.tooltipText;
    this.tooltipComponentRef.instance.position = this.tooltipPosition;

    this.tooltipComponentRef.instance.elementSize.subscribe((size) => {
      this.setTooltipPosition(size);
    });

    this.tooltipComponentRef.changeDetectorRef.detectChanges();
    this.tooltipComponentRef.hostView.detectChanges();
    this.scrollUnlistenFn = this.renderer.listen('window', 'scroll', () =>
      this.destroyTooltip()
    );
  }

  setTooltipPosition(size: { width: number; height: number }) {
    if (!this.tooltipComponentRef) return;
    const targetRect = this.elementRef.nativeElement.getBoundingClientRect();
    const tooltipElement = this.tooltipComponentRef?.location.nativeElement;
    const tooltipRect = size;
    let top, left;
    let scrollPos;
    if (this.isSticked) scrollPos = 0;
    else {
      scrollPos =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
    }
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
    this.tooltipComponentRef.instance.left = left / 16;
    this.tooltipComponentRef.instance.top = (top + scrollPos) / 16;
  }

  destroyTooltip(): void {
    if (this.tooltipComponentRef) {
      this.tooltipComponentRef.destroy();
      this.tooltipComponentRef = null;
    }
    if (this.scrollUnlistenFn) {
      this.scrollUnlistenFn();
      this.scrollUnlistenFn = null;
    }
  }
}
