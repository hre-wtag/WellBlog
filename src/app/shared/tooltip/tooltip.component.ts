import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss',
})
export class TooltipComponent implements OnChanges {
  @Input() text = '';
  @Input() left!: number;
  @Input() top!: number;
  @Output() heightChange = new EventEmitter<number>();
  ngOnChanges() {
    console.log(this.text, this.left, this.top, 'tooltip');
  }
}
