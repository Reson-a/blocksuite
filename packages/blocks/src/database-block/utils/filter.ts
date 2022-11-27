import type { DatabaseItemBlockModel } from '../database-item-model';
import type { ISchema } from '../database-model';

export enum FilterOperator {
  IS_EQUAL,
  IS_NULL,
  IS_NOT_NULL,
  GREATER_THAN,
  LESS_THAN,
}

export interface IFilter {
  id: string;
  value: '';
  operator: FilterOperator;
}

export function filter(
  items: DatabaseItemBlockModel[],
  schemas: ISchema[],
  sorts: IFilter[]
) {
  return items.filter(() => true);
}
