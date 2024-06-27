import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  DefaultValueAccessor,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [DefaultValueAccessor],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent implements OnInit {
  @Input() labelName!: string;
  @Input() fieldName!: string;
  @Input() fControl = new FormControl();

  @Output() blurEvent = new EventEmitter<string>();

  ngOnInit(): void {
    console.log(this.fControl, 'input');
  }

  onBlur(): void {
    this.blurEvent.emit(this.fieldName);
  }
}
