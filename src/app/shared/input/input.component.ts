import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  DefaultValueAccessor,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToggleOnHoldDirective } from '../Directives/toggle-on-hold.directive';
import { ValidatorsService } from '../../core/services/validators.service';

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

  errorMsg!: string | null;
  showPasswoord: boolean | Event = false;

  constructor(private validatorService: ValidatorsService) {}
  ngOnInit(): void {
    console.log(this.fControl, 'input');
  }
  onHoldChange(event: Event | boolean): void {
    this.showPasswoord = event;
  }

  updateErrorMessages(fControl: FormControl): void {
    this.errorMsg = null;

    if (fControl?.touched && fControl?.errors) {
      this.errorMsg = this.validatorService.getErrorMessages(fControl.errors);
    }
  }
  onTouched(fControl: FormControl): void {
    if (fControl) {
      fControl.markAsTouched();
      this.updateErrorMessages(fControl);
    }
  }
}
