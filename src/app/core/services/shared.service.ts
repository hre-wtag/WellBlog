import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  getFormControl(formGroup: FormGroup, formControlName: string): FormControl {
    return formGroup.get(formControlName) as FormControl;
  }
}
