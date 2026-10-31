import {JsonFormsRendererRegistryEntry} from '@jsonforms/core';
import {TextRenderer, textTester} from './text';
import {NumberRenderer, numberTester} from './number';
import {BooleanRenderer, booleanTester} from './boolean';
import {EnumRenderer, enumTester} from './enum';
import {ObjectRenderer, objectTester} from './object';
import {ArrayRenderer, arrayTester} from './array';
import {
  CategorizationLayoutRenderer,
  categorizationLayoutTester,
  GroupLayoutRenderer,
  groupLayoutTester,
  HorizontalLayoutRenderer,
  horizontalLayoutTester,
  LabelRenderer,
  labelTester,
  VerticalLayoutRenderer,
  verticalLayoutTester,
} from './layout';

/**
 * Bootstrap based renderer set for JSON Forms
 */
export const bootstrapRenderers: JsonFormsRendererRegistryEntry[] = [
  {tester: textTester, renderer: TextRenderer},
  {tester: numberTester, renderer: NumberRenderer},
  {tester: booleanTester, renderer: BooleanRenderer},
  {tester: enumTester, renderer: EnumRenderer},
  {tester: objectTester, renderer: ObjectRenderer},
  {tester: arrayTester, renderer: ArrayRenderer},
  {tester: verticalLayoutTester, renderer: VerticalLayoutRenderer},
  {tester: horizontalLayoutTester, renderer: HorizontalLayoutRenderer},
  {tester: groupLayoutTester, renderer: GroupLayoutRenderer},
  {tester: categorizationLayoutTester, renderer: CategorizationLayoutRenderer},
  {tester: labelTester, renderer: LabelRenderer},
];
