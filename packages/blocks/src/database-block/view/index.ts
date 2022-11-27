import type { IFilter, ISort } from '../utils';

export enum DataBaseViewType {
  Table,
  Board,
  Timeline,
  Calender,
  List,
  Gallery,
}

export interface IViewModel {
  name: string;
  type: DataBaseViewType;
  id: string;
  sorts: ISort[];
  filters: IFilter[];
}

export * from './table';
export * from './gallery';
