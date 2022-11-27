import { html } from 'lit';
import type { TextField } from './text-field';
import type { NumberField } from './number-field';
import type { CheckboxField } from './checkbox-field';
import type { SelectField } from './select-field';
import type { DateField } from './date-field';
import TextFieldElement from './text-field';
import NumberFieldElement from './number-field';
import CheckboxFieldElement from './checkbox-field';
import SelectFieldElement from './select-field';
import DateFieldElement from './date-field';

export * from './text-field';
export * from './number-field';
export * from './checkbox-field';
export * from './select-field';
export * from './date-field';

// Define field type strings used in column config
export enum FieldType {
  Text,
  Number,
  Checkbox,
  Select,
  Date,
  Url,
  Image,
  // shortText = 'SIMPLE_TEXT',
  // longText = 'LONG_TEXT',
  // richText = 'RICH_TEXT',
  // email = 'EMAIL',
  // phone = 'PHONE_NUMBER',
  // url = 'URL',
  // // SELECT
  // singleSelect = 'SINGLE_SELECT',
  // multiSelect = 'MULTI_SELECT',
  // // NUMERIC
  // checkbox = 'CHECK_BOX',
  // number = 'NUMBER',
  // percentage = 'PERCENTAGE',
  // rating = 'RATING',
  // slider = 'SLIDER',
  // color = 'COLOR',
  // geoPoint = 'GEO_POINT',
  // // DATE & TIME
  // date = 'DATE',
  // dateTime = 'DATE_TIME',
  // duration = 'DURATION',
  // // FILE
  // image = 'IMAGE',
  // file = 'FILE',
  // // CONNECTION
  // connector = 'CONNECTOR',
  // subTable = 'SUB_TABLE',
  // reference = 'REFERENCE',
  // connectTable = 'DOCUMENT_SELECT',
  // connectService = 'SERVICE_SELECT',
  // // CODE
  // json = 'JSON',
  // code = 'CODE',
  // markdown = 'MARKDOWN',
  // // CLOUD FUNCTION
  // action = 'ACTION',
  // derivative = 'DERIVATIVE',
  // aggregate = 'AGGREGATE',
  // status = 'STATUS',
  // // AUDIT
  // createdBy = 'CREATED_BY',
  // updatedBy = 'UPDATED_BY',
  // createdAt = 'CREATED_AT',
  // updatedAt = 'UPDATED_AT',
  // // METADATA

  // user = 'USER',
  // id = 'ID',
  // last = 'LAST',
}

export type Field =
  | TextField
  | NumberField
  | CheckboxField
  | SelectField
  | DateField;
export interface IFieldElement {
  valueToRender(field: Field): string;
  valueToCompare(field: Field): string | number | boolean | undefined;
}

export class FieldFactory {
  static create(fieldType: FieldType) {
    return {};
  }

  static getField(type: FieldType): IFieldElement | undefined {
    switch (type) {
      case FieldType.Text:
        return TextFieldElement;
      case FieldType.Number:
        return NumberFieldElement;
      case FieldType.Checkbox:
        return CheckboxFieldElement;
      case FieldType.Select:
        return SelectFieldElement;
      case FieldType.Date:
        return DateFieldElement;
      default:
        return;
    }
  }

  static renderField(
    type: FieldType,
    field: Field,
    onChange: (e: CustomEvent) => void
  ) {
    switch (type) {
      case FieldType.Text:
        return html`<affine-text-field
          .field=${field}
          @change=${onChange}
        ></affine-text-field>`;
      case FieldType.Number:
        return html`<affine-number-field
          .field=${field}
          @change=${onChange}
        ></affine-number-field>`;
      case FieldType.Checkbox:
        return html`<affine-checkbox-field
          .field=${field}
          @change=${onChange}
        ></affine-checkbox-field>`;
      case FieldType.Select:
        return html`<affine-select-field
          .field=${field}
          @change=${onChange}
        ></affine-select-field>`;
      case FieldType.Date:
        return html`<affine-date-field
          .field=${field}
          @change=${onChange}
        ></affine-date-field>`;
      default:
        return field + '';
    }
  }

  static compareField(type: FieldType, fieldA: Field, fieldB: Field): number {
    const fieldEle = FieldFactory.getField(type);
    if (!fieldEle) return 0;
    const valueA = fieldEle?.valueToCompare(fieldA) + '';
    const valueB = fieldEle?.valueToCompare(fieldB) + '';
    return valueA.localeCompare(valueB);
  }
}
