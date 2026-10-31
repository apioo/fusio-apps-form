import {Component} from '@angular/core';
import {JsonFormsModule} from '@jsonforms/angular';
import {
  Actions,
  and,
  createDefaultValue,
  findUISchema,
  isControl,
  Paths,
  RankedTester,
  rankWith,
  schemaTypeIs,
  StatePropsOfArrayControl,
  UISchemaElement,
} from '@jsonforms/core';
import {BootstrapArrayControl} from './base-control';

/**
 * Generic array renderer, every item is rendered through JSON Forms so it works for primitive and object items
 */
@Component({
  selector: 'app-form-renderer-array',
  imports: [JsonFormsModule],
  template: `
    @if (!hidden) {
      <div class="mb-3">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="form-label mb-0">{{ label }}</span>
          <button class="btn btn-outline-primary btn-sm" type="button" (click)="addItem()" [disabled]="!enabled">
            <i class="bi bi-plus-lg"></i> Add
          </button>
        </div>
        @if (description) {
          <div class="form-text mt-0 mb-2">{{ description }}</div>
        }
        @for (item of items; track $index; let i = $index, first = $first, last = $last) {
          <div class="card mb-2">
            <div class="card-body pb-0">
              @if (detail) {
                <jsonforms-outlet [uischema]="detail" [schema]="scopedSchema" [path]="itemPath(i)"></jsonforms-outlet>
              }
            </div>
            <div class="card-footer text-end">
              <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-secondary" type="button" title="Move up" (click)="move(i, i - 1)" [disabled]="!enabled || first"><i class="bi bi-arrow-up"></i></button>
                <button class="btn btn-outline-secondary" type="button" title="Move down" (click)="move(i, i + 1)" [disabled]="!enabled || last"><i class="bi bi-arrow-down"></i></button>
                <button class="btn btn-outline-danger" type="button" title="Remove" (click)="removeItem(i)" [disabled]="!enabled"><i class="bi bi-trash"></i></button>
              </div>
            </div>
          </div>
        } @empty {
          <div class="text-body-secondary small border rounded p-2 mb-2">No items</div>
        }
        @if (error) {
          <div class="invalid-feedback d-block">{{ error }}</div>
        }
      </div>
    }
  `
})
export class ArrayRenderer extends BootstrapArrayControl {
  detail?: UISchemaElement;

  get items(): any[] {
    return Array.isArray(this.data) ? this.data : [];
  }

  override mapAdditionalProps(props: StatePropsOfArrayControl): void {
    if (!this.detail) {
      this.detail = findUISchema(
        props.uischemas ?? [],
        props.schema,
        this.uischema.scope,
        props.path,
        'VerticalLayout',
        this.uischema,
        props.rootSchema
      );
    }
    super.mapAdditionalProps(props);
  }

  itemPath(index: number): string {
    return Paths.compose(this.propsPath, `${index}`);
  }

  addItem() {
    const value = createDefaultValue(this.scopedSchema, this.rootSchema);
    this.update((items) => [...items, value]);
  }

  removeItem(index: number) {
    this.update((items) => items.filter((_, i) => i !== index));
  }

  move(from: number, to: number) {
    this.update((items) => {
      if (to < 0 || to >= items.length) {
        return items;
      }
      const result = [...items];
      [result[from], result[to]] = [result[to], result[from]];
      return result;
    });
  }

  private update(fn: (items: any[]) => any[]) {
    this.jsonFormsService.updateCore(
      Actions.update(this.propsPath, (current) => fn(Array.isArray(current) ? current : []))
    );
    this.triggerValidation();
  }
}

export const arrayTester: RankedTester = rankWith(2, and(isControl, schemaTypeIs('array')));
