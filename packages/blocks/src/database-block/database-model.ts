import { Space, BaseBlockModel, IBaseBlockProps } from '@blocksuite/store';
import type { DatabaseItemBlockModel } from './database-item-model';
import { FieldType } from './fields';
import { DataBaseViewType, ITableViewModel } from './view';
import type { IViewModel } from './view';
import {
  filter,
  FilterOperator,
  IFilter,
  ISort,
  sort,
  SortDirection,
  group,
} from './utils';
import type { IGroup } from './utils/group';

export interface DatabaseBlockProps extends IBaseBlockProps {
  flavour: 'affine:database';
  /** packed field */
  name: string;
  views: IViewModel[];
  children: DatabaseItemBlockModel[];
  schemas: ISchema[];
  currentViewId: string /*  */;
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
        { id: '0', name: 'Text', type: FieldType.Text },
        { id: '1', name: 'Number', type: FieldType.Number },
        { id: '2', name: 'Checkbox', type: FieldType.Checkbox },
        { id: '3', name: 'Select', type: FieldType.Select },
      ],
      currentViewId: '0',
    });
    block.addView({
      name: 'Table',
    });
    block.addView({
      type: DataBaseViewType.Gallery,
      name: 'Gallery',
    });
    block.addView({
      type: DataBaseViewType.Board,
      name: 'Board',
    });
    return block;
  }

  getItems(withGroup?: boolean) {
    const currentView = this.currentView;
    const schemaMap = this.schemas.reduce((prev, item) => {
      prev[item.id] = item;
      return prev;
    }, {} as Record<string, ISchema>);
    let items = filter(
      this.children,
      schemaMap,
      currentView.filterType,
      currentView.filters
    );
    items = sort(items, schemaMap, currentView.sorts);
    if (withGroup) {
      if (this.currentView.groups?.length) {
        return group(items, schemaMap, currentView.groups);
        // 看板视图默认需要分组
      } else if (this.currentView.type == DataBaseViewType.Board) {
        return group(items, schemaMap, [{ id: this.schemas[0].id }]);
      }
    }

    return items;
  }

  getItemById(id: string) {
    const index = this.childMap.get(id);
    if (index == undefined || index < 0 || index > this.children.length) return;
    return this.children[index];
  }

  addItem(
    props: Partial<DatabaseItemBlockModel> = {},
    index = this.children.length
  ) {
    const id = this.space.addBlock(
      { flavour: 'affine:database-item', ...props },
      this,
      index
    );
    return this.space.getBlockById(id);
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
    props?: Partial<T>,
    index: number = this.views.length
  ) {
    const newView = {
      id: `${this.views.length}`,
      name: `View${this.views.length}`,
      type: DataBaseViewType.Table,
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

  addSchema(schema?: ISchema, index: number = this.schemas.length) {
    const newSchema = {
      id: `${this.schemas.length}`,
      name: `Text${this.schemas.length}`,
      type: FieldType.Text,
      ...schema,
    };
    this.schemas.splice(index, 0, newSchema);
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

  get currentSorts() {
    return this.currentView?.sorts || [];
  }

  get currentFilters() {
    return this.currentView?.filters || [];
  }

  get currentGroups() {
    return this.currentView?.groups || [];
  }

  addSort(sort: Partial<ISort> = {}, index: number = this.currentSorts.length) {
    const newSort = {
      id: this.schemas[0].id,
      direction: SortDirection.ASC,
      ...sort,
    };
    const sorts = this.currentSorts;
    sorts.splice(index, 0, newSort);
    this.currentView.sorts = [...sorts];
    this.syncViews();
  }
  updateSort(id: string, sort: Partial<ISort>) {
    const sortIndex = this.currentSorts.findIndex(sort => sort.id == id);
    this.currentSorts[sortIndex] = {
      ...this.currentSorts[sortIndex],
      ...sort,
    };
    this.syncViews();
  }
  deleteSort(id: string) {
    this.currentView.sorts = this.currentSorts.filter(sort => sort.id !== id);
    this.syncViews();
  }

  addFilter(
    filter: Partial<IFilter> = {},
    index: number = this.currentFilters.length
  ) {
    const newFilter = {
      id: this.schemas[0].id,
      value: '',
      operator: FilterOperator.IS_NOT_NULL,
      ...filter,
    };
    const filters = this.currentFilters;
    filters.splice(index, 0, newFilter);
    this.currentView.filters = [...filters];
    this.syncViews();
  }
  updateFilter(id: string, filter: Partial<IFilter>) {
    const filterIndex = this.currentFilters.findIndex(
      filter => filter.id == id
    );
    this.currentFilters[filterIndex] = {
      ...this.currentFilters[filterIndex],
      ...filter,
    };
    this.syncViews();
  }
  deleteFilter(id: string) {
    this.currentView.filters = this.currentFilters.filter(
      filter => filter.id !== id
    );
    this.syncViews();
  }

  hasGroup() {
    return this.currentView.groups?.length;
  }

  addGroup(
    group: Partial<IGroup> = {},
    index: number = this.currentGroups.length
  ) {
    const newGroup = {
      id: this.schemas[0].id,
      ...group,
    };
    const groups = this.currentGroups;
    groups.splice(index, 0, newGroup);
    this.currentView.groups = [...groups];
    this.syncViews();
  }
  updateGroup(id: string, group: Partial<IGroup>) {
    const groupIndex = this.currentGroups.findIndex(group => group.id == id);
    this.currentGroups[groupIndex] = {
      ...this.currentGroups[groupIndex],
      ...group,
    };
    this.syncViews();
  }
  deleteGroup(id: string) {
    this.currentView.groups = this.currentGroups.filter(
      group => group.id !== id
    );
    this.syncViews();
  }
}
