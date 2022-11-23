import type { DateField } from './date-field';
import dateField from './date-field';
import type { NumberField } from './number-field';
import numberField from './number-field';
import type { SelectField } from './select-field';
import type { TextField } from './text-field';
import textField from './text-field';

// Define field type strings used in column config
export enum FieldType {
  Text,
  Number,
  Select,
  Date,
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

export type Field = TextField | NumberField | DateField | SelectField;

export class FieldFactory {
  static create(fieldType: FieldType) {
    return {};
  }
  static render(type: FieldType, field: Field) {
    switch (type) {
      case FieldType.Text:
        return textField.render(field as TextField);
      case FieldType.Number:
        return numberField.render(field as NumberField);
      case FieldType.Date:
        return dateField.render(field as DateField);
      case FieldType.Select:
        return;
    }
  }
}
