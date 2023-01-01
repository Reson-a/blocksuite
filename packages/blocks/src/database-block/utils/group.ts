import type { DatabaseItemBlockModel } from '../database-item-model';
import type { ISchema } from '../database-model';
import { FieldFactory } from '../fields';
import { SortDirection } from './sort';

export interface IGroup {
  id: string;
  sort?: SortDirection;
}

export interface IGroupItem {
  id: string;
  group: IGroup;
  schema: ISchema;
  items: DatabaseItemBlockModel[]; // | IGroupItem[]
}

function groupBy(
  items: DatabaseItemBlockModel[],
  group: IGroup,
  schema: ISchema
) {
  const map = new Map<string, IGroupItem>();
  items.forEach(item => {
    const field = item.fields[schema.id];
    const id = field
      ? FieldFactory.getField(schema.type)?.valueToCompare(field) + ''
      : '';
    if (!map.get(id)) map.set(id, { id, group, schema, items: [] });
    (map.get(id) as IGroupItem).items.push(item);
  });

  return [...map.values()].sort((a, b) => {
    if (!a.id.length) return 1;
    return group.sort == SortDirection.DESC
      ? b.id.localeCompare(a.id)
      : a.id.localeCompare(b.id);
  });
}

export function group(
  items: DatabaseItemBlockModel[],
  schemaMap: Record<string, ISchema>,
  groups: IGroup[] = []
) {
  // TODO nest group with sort
  const group = groups[0];
  return groupBy(items, group, schemaMap[group.id]);
}
