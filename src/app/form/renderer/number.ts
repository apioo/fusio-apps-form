import {Component} from '@angular/core';
import {isIntegerControl, isNumberControl, or, RankedTester, rankWith} from '@jsonforms/core';
import {BootstrapControl} from './base-control';

@Component({
  selector: 'app-form-renderer-number',
  template: `
    @if (!hidden) {
      <div class="mb-3">
        <label [attr.for]="id" class="form-label">{{ label }}</label>
        <input
          type="number"
          [id]="id"
          class="form-control"
          [class.is-invalid]="showError"
          [value]="data ?? ''"
          [attr.step]="isInteger ? 1 : 'any'"
          [attr.min]="scopedSchema.minimum ?? null"
          [attr.max]="scopedSchema.maximum ?? null"
          [disabled]="!enabled"
          (input)="onInput($event)"
          (blur)="markTouched()"
        />
        @if (showError) {
          <div class="invalid-feedback d-block">{{ error }}</div>
        } @else if (description) {
          <div class="form-text">{{ description }}</div>
        }
      </div>
    }
  `
})
export class NumberRenderer extends BootstrapControl {
  get isInteger(): boolean {
    return this.scopedSchema?.type === 'integer';
  }

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (value === '') {
      this.onChange(undefined);
      return;
    }
    const number = this.isInteger ? parseInt(value, 10) : parseFloat(value);
    this.onChange(isNaN(number) ? undefined : number);
  }
}

export const numberTester: RankedTester = rankWith(2, or(isIntegerControl, isNumberControl));
