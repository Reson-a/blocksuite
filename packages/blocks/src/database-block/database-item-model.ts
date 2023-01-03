import { Page, BaseBlockModel, IBaseBlockProps } from '@blocksuite/store';
import type { Field } from './fields/index.js';

export type FieldId = 'string';

export interface DatabaseItemBlockProps extends IBaseBlockProps {
  flavour: 'affine:database-item';
  /** packed field */
  fields: Record<string, Field>;
}

export class DatabaseItemBlockModel
  extends BaseBlockModel
  implements DatabaseItemBlockProps
{
  flavour = 'affine:database-item' as const;
  fields: Record<string, Field>;

  constructor(page: Page, props: Partial<DatabaseItemBlockModel>) {
    super(page, props);
    this.fields = props.fields || {};
  }

  syncFields() {
    this.propsUpdated.emit();
    // this.space.updateBlock(this, {
    //   fields: { ...this.fields },
    // });
  }

  addField(id: string, value?: any) {
    this.fields[id] = value;
    this.syncFields();
  }

  updateField(id: string, value?: any) {
    this.fields[id] = value;
    this.syncFields();
  }

  deleteField(id: string) {
    delete this.fields[id];
    this.syncFields();
  }
}
