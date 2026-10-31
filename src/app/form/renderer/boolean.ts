import {Component} from '@angular/core';
import {isBooleanControl, RankedTester, rankWith} from '@jsonforms/core';
import {BootstrapControl} from './base-control';

@Component({
  selector: 'app-form-renderer-boolean',
  template: `
    @if (!hidden) {
      <div class="mb-3 form-check">
        <input
          type="checkbox"
          class="form-check-input"
          [class.is-invalid]="showError"
          [id]="id"
          [checked]="!!data"
          [disabled]="!enabled"
          (change)="onCheck($event)"
        />
        <label class="form-check-label" [attr.for]="id">{{ label }}</label>
        @if (showError) {
          <div class="invalid-feedback d-block">{{ error }}</div>
        } @else if (description) {
          <div class="form-text">{{ description }}</div>
        }
      </div>
    }
  `
})
export class BooleanRenderer extends BootstrapControl {
  onCheck(event: Event) {
    this.markTouched();
    this.onChange((event.target as HTMLInputElement).checked);
  }
}

export const booleanTester: RankedTester = rankWith(2, isBooleanControl);
