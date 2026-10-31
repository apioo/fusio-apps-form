import {Component} from '@angular/core';
import {isEnumControl, isOneOfEnumControl, or, RankedTester, rankWith} from '@jsonforms/core';
import {BootstrapControl} from './base-control';

interface Option {
  label: string;
  value: any;
}

@Component({
  selector: 'app-form-renderer-enum',
  template: `
    @if (!hidden) {
      <div class="mb-3">
        <label [attr.for]="id" class="form-label">{{ label }}</label>
        <select
          [id]="id"
          class="form-select"
          [class.is-invalid]="showError"
          [disabled]="!enabled"
          (change)="onSelect($event)"
          (blur)="markTouched()">
          <option value="" [selected]="selectedIndex === -1"></option>
          @for (option of options; track $index) {
            <option [value]="$index" [selected]="selectedIndex === $index">{{ option.label }}</option>
          }
        </select>
        @if (showError) {
          <div class="invalid-feedback d-block">{{ error }}</div>
        } @else if (description) {
          <div class="form-text">{{ description }}</div>
        }
      </div>
    }
  `
})
export class EnumRenderer extends BootstrapControl {
  get options(): Option[] {
    const schema = this.scopedSchema;
    if (Array.isArray(schema?.enum)) {
      return schema.enum.map((value) => ({label: String(value), value}));
    }
    if (Array.isArray(schema?.oneOf)) {
      return schema.oneOf.map((entry) => ({label: entry.title ?? String(entry.const), value: entry.const}));
    }
    return [];
  }

  get selectedIndex(): number {
    return this.options.findIndex((option) => option.value === this.data);
  }

  onSelect(event: Event) {
    this.markTouched();
    const index = (event.target as HTMLSelectElement).value;
    this.onChange(index === '' ? undefined : this.options[parseInt(index, 10)]?.value);
  }
}

export const enumTester: RankedTester = rankWith(5, or(isEnumControl, isOneOfEnumControl));
