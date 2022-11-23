import type { DatabaseItemBlockModel } from '../database-item-model';

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

export function filter(items: DatabaseItemBlockModel[], sorts: IFilter[]) {
  return items.filter(() => true);
}
