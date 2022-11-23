import { Space, BaseBlockModel, IBaseBlockProps } from '@blocksuite/store';
import type { DatabaseItemBlockModel } from './database-item-model';
import { FieldType } from './fields';
import { DataBaseViewType, ITableViewModel } from './view';
import type { IViewModel } from './view';
import { filter, sort } from './utils';

export interface DatabaseBlockProps extends IBaseBlockProps {
  flavour: 'affine:database';
  /** packed field */
  name: string;
  views: IViewModel[];
  children: DatabaseItemBlockModel[];
  schemas: ISchema[];
  currentViewId: string;
}

export interface ISchema {
  id: string;
  name: string;
  type: FieldType;
}

export class DatabaseBlockModel
  extends BaseBlockModel
  implements DatabaseBlockProps
{
  flavour = 'affine:database' as const;
  name = '';
  views: IViewModel[] = [];
  children: DatabaseItemBlockModel[] = [];
  schemas: ISchema[] = [];
  currentViewId = '';
  currentView!: IViewModel;

  constructor(space: Space, props: Partial<DatabaseBlockModel>) {
    super(space, props);
    if (!props.views)
      return DatabaseBlockModel.createDefaultDatabaseBlock(space, props);
    this.views = props.views || [];
    this.schemas = props.schemas || [];
    this.children = props.children || [];
    this.name = props.name || '';
    this.setActiveView(props.currentViewId || this.views[0]?.id);
  }

  static createDefaultDatabaseBlock(
    space: Space,
    props: Partial<DatabaseBlockModel>
  ) {
    const block = new DatabaseBlockModel(space, {
      ...props,
      name: 'TEST_DATABASE',
      views: [],
      children: [],
      schemas: [
        { id: '0', name: 'NAME', type: FieldType.Text },
        { id: '1', name: 'PHONE', type: FieldType.Number },
        { id: '2', name: 'CREATED_AT', type: FieldType.Date },
      ],
      currentViewId: '0',
    });
    block.addView();
    return block;
  }

  getItems() {
    const currentView = this.currentView;
    let items = filter(this.children, currentView.filters);
    items = sort(items, currentView.sorts);
    return items;
  }

  getItemById(id: string) {
    const index = this.childMap.get(id);
    if (index == undefined || index < 0 || index > this.children.length) return;
    return this.children[index];
  }

  addItem(
    props: Partial<DatabaseItemBlockModel>,
    index = this.children.length
  ) {
    this.space.addBlock(
      { flavour: 'affine:database-item', ...props },
      this,
      index
    );
  }

  updateItem(id: string, props: Partial<DatabaseItemBlockModel>) {
    this.space.updateBlockById(id, props);
  }

  deleteItem(id: string) {
    this.space.deleteBlockById(id);
  }

  syncViews() {
    this.propsUpdated.emit();
    // TODO not supported for now
    // this.space.updateBlock(this, {
    //   views: [...this.views],
    // });
  }

  addView<T extends IViewModel>(
    index: number = this.views.length,
    props?: Partial<T>
  ) {
    const newView = {
      id: `${this.views.length}`,
      name: `Table${this.views.length}`,
      sorts: [],
      filters: [],
      type: DataBaseViewType.Table,
      row: {},
      col: {},
      ...props,
    };
    this.views.splice(index, 0, newView);
    this.views = [...this.views];
    this.syncViews();
    this.setActiveView(newView.id);
  }

  updateView<T extends IViewModel>(id: string, props?: Partial<T>) {
    const viewIndex = this.views.findIndex(view => view.id == id);
    this.views[viewIndex] = { ...this.views[viewIndex], ...props };
    this.syncViews();
  }

  deleteView(id: string) {
    this.views = this.views.filter(view => view.id !== id);
    this.syncViews();
  }

  setActiveView(id: string) {
    this.space.updateBlock(this, { currentViewId: id });
    this.currentView =
      this.views.find(view => view.id == this.currentViewId) || this.views[0];
  }

  syncSchemas() {
    // TODO not supported for now
    this.propsUpdated.emit();
    // this.space.updateBlock(this, {
    //   schemas: [...this.schemas],
    // });
  }

  addSchema(index: number = this.schemas.length, schema?: ISchema) {
    const newSchema = {
      id: `${this.schemas.length}`,
      name: `TEXT_${this.schemas.length}`,
      type: FieldType.Text,
      ...schema,
    };
    this.schemas.splice(index, 1, newSchema);
    this.schemas = [...this.schemas];
    this.syncSchemas();
    this.children.forEach(item => item.addField(newSchema.id));
  }

  updateSchema(id: string, props: Partial<ISchema>) {
    const schemaIndex = this.schemas.findIndex(view => view.id == id);
    this.schemas[schemaIndex] = { ...this.schemas[schemaIndex], ...props };
    this.syncSchemas();
    this.children.forEach(item => item.updateField(id));
  }

  deleteSchema(id: string) {
    this.schemas = this.schemas.filter(schema => schema.id !== id);
    this.syncSchemas();
    this.children.forEach(item => item.deleteField(id));
  }

  getSchemaById(id: string) {
    return this.schemas.find(schema => schema.id == id);
  }
}
