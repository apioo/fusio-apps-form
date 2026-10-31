import {Component} from '@angular/core';
import {isStringControl, RankedTester, rankWith} from '@jsonforms/core';
import {BootstrapControl} from './base-control';

@Component({
  selector: 'app-form-renderer-text',
  template: `
    @if (!hidden) {
      <div class="mb-3">
        <label [attr.for]="id" class="form-label">{{ label }}</label>
        @if (multiline) {
          <textarea
            [id]="id"
            class="form-control"
            rows="4"
            [class.is-invalid]="showError"
            [value]="data ?? ''"
            [disabled]="!enabled"
            (input)="onInput($event)"
            (blur)="markTouched()"></textarea>
        } @else {
          <input
            [type]="inputType"
            [id]="id"
            class="form-control"
            [class.is-invalid]="showError"
            [value]="displayValue"
            [attr.maxlength]="scopedSchema.maxLength ?? null"
            [disabled]="!enabled"
            (input)="onInput($event)"
            (blur)="markTouched()"
          />
        }
        @if (showError) {
          <div class="invalid-feedback d-block">{{ error }}</div>
        } @else if (description) {
          <div class="form-text">{{ description }}</div>
        }
      </div>
    }
  `
})
export class TextRenderer extends BootstrapControl {
  get multiline(): boolean {
    return !!this.uischema?.options?.['multi'];
  }

  get inputType(): string {
    switch (this.scopedSchema?.format) {
      case 'date': return 'date';
      case 'date-time': return 'datetime-local';
      case 'time': return 'time';
      case 'email': return 'email';
      case 'uri': return 'url';
      case 'password': return 'password';
      default: return 'text';
    }
  }

  get displayValue(): string {
    if (typeof this.data !== 'string') {
      return '';
    }
    if (this.inputType === 'datetime-local' && this.data !== '') {
      const date = new Date(this.data);
      if (!isNaN(date.getTime())) {
        // datetime-local inputs require a local "YYYY-MM-DDTHH:mm" value
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      }
    }
    return this.data;
  }

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    if (value === '') {
      this.onChange(undefined);
    } else if (this.inputType === 'datetime-local') {
      this.onChange(new Date(value).toISOString());
    } else if (this.inputType === 'time' && value.length === 5) {
      this.onChange(value + ':00');
    } else {
      this.onChange(value);
    }
  }
}

export const textTester: RankedTester = rankWith(1, isStringControl);
