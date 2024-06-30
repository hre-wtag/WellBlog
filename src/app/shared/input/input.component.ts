import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
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
export class InputComponent {
  @Input() fieldlabel!: string;
  @Input() fieldName!: string;
  @Input() fieldType!: 'text' | 'password' | 'email';
  @Input() passwordMatched!: boolean;
  @Input() fControl = new FormControl();

  errorMsg!: string | null;
  showPasswoord: boolean | Event = false;
  private validatorService = inject(ValidatorsService);

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
      fControl.markAsDirty();
      this.updateErrorMessages(fControl);
    }
  }
}
