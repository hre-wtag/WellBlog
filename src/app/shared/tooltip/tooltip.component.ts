import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss',
})
export class TooltipComponent implements AfterViewInit {
  @Input() text = '';
  @Input() left!: number;
  @Input() top!: number;
  @Input() position!: string;
  @Output() elementSize = new EventEmitter<{ width: number; height: number }>();
  @ViewChild('tooltipRef') tooltipRef!: ElementRef;

  ngAfterViewInit() {
    const width = this.tooltipRef.nativeElement.offsetWidth;
    const height = this.tooltipRef.nativeElement.offsetHeight;
    this.elementSize.emit({ width, height });
    console.log(this.text, this.left, this.top, this.position, 'tooltip');
  }
}
