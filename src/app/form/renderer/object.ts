import {Component} from '@angular/core';
import {JsonFormsModule} from '@jsonforms/angular';
import {
  findUISchema,
  isObjectControl,
  JsonFormsState,
  mapStateToControlWithDetailProps,
  RankedTester,
  rankWith,
  StatePropsOfControlWithDetail,
  UISchemaElement,
} from '@jsonforms/core';
import {BootstrapControl} from './base-control';

@Component({
  selector: 'app-form-renderer-object',
  imports: [JsonFormsModule],
  template: `
    @if (!hidden && detail) {
      <fieldset class="border rounded p-3 mb-3">
        @if (label) {
          <legend class="float-none w-auto px-2 fs-6 fw-bold mb-0">{{ label }}</legend>
        }
        <jsonforms-outlet [uischema]="detail" [schema]="scopedSchema" [path]="propsPath"></jsonforms-outlet>
      </fieldset>
    }
  `
})
export class ObjectRenderer extends BootstrapControl {
  detail?: UISchemaElement;

  protected override mapToProps(state: JsonFormsState): StatePropsOfControlWithDetail {
    return mapStateToControlWithDetailProps(state, this.getOwnProps());
  }

  override mapAdditionalProps(props: StatePropsOfControlWithDetail): void {
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
}

export const objectTester: RankedTester = rankWith(2, isObjectControl);
