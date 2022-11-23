import type { DatabaseItemBlockModel } from '../database-item-model';

export enum SortDirection {
  ASC,
  DESC,
  NONE,
}

export interface ISort {
  id: string;
  direction: SortDirection;
}

export function sort(items: DatabaseItemBlockModel[], sorts: ISort[]) {
  if (!sorts.length) return items;
  return [...items].sort((a, b) => {
    return a - b;
  });
}
