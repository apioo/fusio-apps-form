import {ChangeDetectorRef, Component, inject} from '@angular/core';
import {JsonFormsArrayControl, JsonFormsControl} from '@jsonforms/angular';

/**
 * Base class for all bootstrap controls. The app runs zoneless, so we need to notify Angular whenever the JSON Forms
 * state has changed. We also pass raw values to onChange instead of events.
 */
@Component({template: ''})
export abstract class BootstrapControl extends JsonFormsControl {
  protected cdr = inject(ChangeDetectorRef);

  touched = false;

  override getEventValue = (value: any) => value;

  override mapAdditionalProps(_props?: any): void {
    this.cdr.markForCheck();
  }

  markTouched(): void {
    this.touched = true;
  }

  get showError(): boolean {
    return !!this.error && this.touched;
  }
}

@Component({template: ''})
export abstract class BootstrapArrayControl extends JsonFormsArrayControl {
  protected cdr = inject(ChangeDetectorRef);

  override getEventValue = (value: any) => value;

  override mapAdditionalProps(_props?: any): void {
    this.cdr.markForCheck();
  }
}
