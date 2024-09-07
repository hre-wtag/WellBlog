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
  @Input() showTooltip: boolean = false;
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
      if (this.showTooltip) {
        this.createTooltip();
      } else {
        this.destroyTooltip();
      }
    }
  }

  ngOnDestroy(): void {
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

  private setTooltipPosition(size: { width: number; height: number }) {
    if (!this.tooltipComponentRef) return;
    const targetElement = this.elementRef.nativeElement;
    const targetPos = this.getActualViewportPosition(targetElement);

    const tooltipRect = size;
    let top: number = 0;
    let left: number = 0;

    if (this.tooltipPosition === 'top') {
      top = targetPos.top - tooltipRect.height - this.offset;
      left = targetPos.left + (targetPos.width - tooltipRect.width) / 2;
    } else if (this.tooltipPosition === 'bottom') {
      top = targetPos.top + targetPos.height + this.offset;
      left = targetPos.left + (targetPos.width - tooltipRect.width) / 2;
    } else if (this.tooltipPosition === 'left') {
      top = targetPos.top + (targetPos.height - tooltipRect.height) / 2;
      left = targetPos.left - tooltipRect.width - this.offset;
    } else if (this.tooltipPosition === 'right') {
      top = targetPos.top + (targetPos.height - tooltipRect.height) / 2;
      left = targetPos.left + targetPos.width + this.offset;
    }

    this.tooltipComponentRef.instance.left = left / 16;
    this.tooltipComponentRef.instance.top = top / 16;
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

  getActualViewportPosition(element: HTMLElement): {
    left: number;
    top: number;
    width: number;
    height: number;
  } {
    const rect = element.getBoundingClientRect();

    // get the offset position from the closest positioned ancestor
    const offsetParent = element.offsetParent as HTMLElement | null;
    const offsetParentRect = offsetParent
      ? offsetParent.getBoundingClientRect()
      : { left: 0, top: 0 };

    return {
      left: rect.left - offsetParentRect.left,
      top: rect.top - offsetParentRect.top,
      width: rect.width,
      height: rect.height,
    };
  }
}
