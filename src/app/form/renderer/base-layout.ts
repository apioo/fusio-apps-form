import {ChangeDetectorRef, Directive, inject, OnInit} from '@angular/core';
import {JsonFormsAngularService, JsonFormsBaseRenderer} from '@jsonforms/angular';
import {JsonFormsState, Layout, mapStateToLayoutProps, UISchemaElement} from '@jsonforms/core';

/**
 * Base class for all layout renderers, handles visibility rules and change detection
 */
@Directive()
export abstract class BootstrapLayout<T extends Layout = Layout> extends JsonFormsBaseRenderer<T> implements OnInit {
  protected jsonFormsService = inject(JsonFormsAngularService);
  protected cdr = inject(ChangeDetectorRef);

  hidden = false;
  label?: string;

  ngOnInit(): void {
    this.addSubscription(
      this.jsonFormsService.$state.subscribe({
        next: (state: JsonFormsState) => {
          const props = mapStateToLayoutProps(state, this.getOwnProps());
          this.hidden = !props.visible;
          this.label = props.label;
          this.cdr.markForCheck();
        },
      })
    );
  }

  get elements(): UISchemaElement[] {
    return this.uischema?.elements ?? [];
  }
}
