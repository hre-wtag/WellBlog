import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss',
})
export class TooltipComponent implements OnInit, AfterViewInit {
  @Input() text = '';
  @Input() left!: number;
  @Input() top!: number;
  @Output() elementSize = new EventEmitter<{ width: number; height: number }>();
  @ViewChild('tooltipRef') tooltipRef!: ElementRef;

  ngOnInit() {
    console.log(this.text, this.left, this.top, 'tooltip');
  }
  ngAfterViewInit() {
    const width = this.tooltipRef.nativeElement.offsetWidth;
    const height = this.tooltipRef.nativeElement.offsetHeight;

    this.elementSize.emit({ width, height });
  }
}
