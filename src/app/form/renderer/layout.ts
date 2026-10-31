import {Component} from '@angular/core';
import {JsonFormsBaseRenderer, JsonFormsModule} from '@jsonforms/angular';
import {
  Categorization,
  Category,
  GroupLayout,
  HorizontalLayout,
  isVisible,
  LabelElement,
  RankedTester,
  rankWith,
  uiTypeIs,
  VerticalLayout,
} from '@jsonforms/core';
import {BootstrapLayout} from './base-layout';

@Component({
  selector: 'app-form-renderer-vertical-layout',
  imports: [JsonFormsModule],
  template: `
    @if (!hidden) {
      <div>
        @for (element of elements; track $index) {
          <jsonforms-outlet [uischema]="element" [schema]="schema" [path]="path"></jsonforms-outlet>
        }
      </div>
    }
  `
})
export class VerticalLayoutRenderer extends BootstrapLayout<VerticalLayout> {
}

export const verticalLayoutTester: RankedTester = rankWith(1, uiTypeIs('VerticalLayout'));

@Component({
  selector: 'app-form-renderer-horizontal-layout',
  imports: [JsonFormsModule],
  template: `
    @if (!hidden) {
      <div class="row">
        @for (element of elements; track $index) {
          <div class="col-md">
            <jsonforms-outlet [uischema]="element" [schema]="schema" [path]="path"></jsonforms-outlet>
          </div>
        }
      </div>
    }
  `
})
export class HorizontalLayoutRenderer extends BootstrapLayout<HorizontalLayout> {
}

export const horizontalLayoutTester: RankedTester = rankWith(1, uiTypeIs('HorizontalLayout'));

@Component({
  selector: 'app-form-renderer-group-layout',
  imports: [JsonFormsModule],
  template: `
    @if (!hidden) {
      <fieldset class="border rounded p-3 mb-3">
        @if (label) {
          <legend class="float-none w-auto px-2 fs-6 fw-bold mb-0">{{ label }}</legend>
        }
        @for (element of elements; track $index) {
          <jsonforms-outlet [uischema]="element" [schema]="schema" [path]="path"></jsonforms-outlet>
        }
      </fieldset>
    }
  `
})
export class GroupLayoutRenderer extends BootstrapLayout<GroupLayout> {
}

export const groupLayoutTester: RankedTester = rankWith(1, uiTypeIs('Group'));

@Component({
  selector: 'app-form-renderer-categorization-layout',
  imports: [JsonFormsModule],
  template: `
    @if (!hidden) {
      <ul class="nav nav-tabs mb-3">
        @for (category of categories; track $index) {
          <li class="nav-item">
            <button type="button" class="nav-link" [class.active]="selected === $index" (click)="selected = $index">{{ category.label }}</button>
          </li>
        }
      </ul>
      @if (categories[selected]; as category) {
        @for (element of category.elements; track $index) {
          <jsonforms-outlet [uischema]="element" [schema]="schema" [path]="path"></jsonforms-outlet>
        }
      }
    }
  `
})
export class CategorizationLayoutRenderer extends BootstrapLayout<Categorization> {
  selected = 0;

  get categories(): Category[] {
    const core = this.jsonFormsService.getState().jsonforms.core;
    return (this.uischema?.elements ?? []).filter(
      (category): category is Category =>
        category.type === 'Category' && isVisible(category, core?.data, this.path, core?.ajv as any, this.jsonFormsService.getConfig())
    );
  }
}

export const categorizationLayoutTester: RankedTester = rankWith(1, uiTypeIs('Categorization'));

@Component({
  selector: 'app-form-renderer-label',
  template: `<p class="fw-semibold mb-3">{{ uischema.text }}</p>`
})
export class LabelRenderer extends JsonFormsBaseRenderer<LabelElement> {
}

export const labelTester: RankedTester = rankWith(1, uiTypeIs('Label'));
