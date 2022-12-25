import type { DatabaseItemBlockModel } from '../database-item-model';
import type { ISchema } from '../database-model';
import { FieldFactory } from '../fields';

export interface IGroup {
  id: string;
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
  const map = {} as Record<string, IGroupItem>;
  items.forEach(item => {
    const id =
      FieldFactory.getField(schema.type)?.valueToCompare(
        item.fields[schema.id]
      ) + '';
    map[id] = map[id] || { id, group, schema, items: [] };
    map[id].items.push(item);
  });

  return Object.values(map).sort((a, b) => a.id.localeCompare(b.id));
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
