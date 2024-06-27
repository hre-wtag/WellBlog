import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  DefaultValueAccessor,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToggleOnHoldDirective } from '../Directives/toggle-on-hold.directive';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ToggleOnHoldDirective],
  providers: [DefaultValueAccessor],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent implements OnInit {
  @Input() fieldlabel!: string;
  @Input() fieldName!: string;
  @Input() fieldType!: 'text' | 'password';
  @Input() fControl = new FormControl();
  @Input() errorMsg!: string | null;
  @Output() blurEvent = new EventEmitter<string>();
  textFieldType: boolean | Event = false;
  ngOnInit(): void {
    console.log(this.fControl, 'input');
  }
  onHoldChange(event: Event | boolean): void {
    this.textFieldType = event;
    console.log(event);
  }
  onBlur(): void {
    this.blurEvent.emit(this.fieldName);
  }
}
