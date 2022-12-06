import type { DatabaseItemBlockModel } from '../database-item-model';
import type { ISchema } from '../database-model';
import { Field, FieldFactory } from '../fields';

export enum SortDirection {
  ASC,
  DESC,
  NONE,
}

export interface ISort {
  id: string;
  direction: SortDirection;
}

type Comparator = (a: Field, b: Field) => number;

export function sort(
  items: DatabaseItemBlockModel[],
  schemas: ISchema[],
  sorts: ISort[]
) {
  if (!sorts.length) return items;
  return [...items].sort((a, b) => {
    let result = 0;
    sorts.some(sort => {
      if (sort.direction == SortDirection.NONE) return;
      const fieldType = schemas.find(schema => schema.id == sort.id)?.type;
      if (fieldType == undefined) return;
      result = FieldFactory.compareField(
        fieldType,
        a.fields[sort.id],
        b.fields[sort.id]
      );
      if (result == 0) return;
      else result = sort.direction === SortDirection.ASC ? result : -result;
      return true;
    });
    return result;
  });
}
