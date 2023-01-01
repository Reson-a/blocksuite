import type { FilterType, IFilter, ISort } from '../utils';
import type { IGroup } from '../utils/group';

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
  sorts?: ISort[];
  filters?: IFilter[];
  filterType?: FilterType;
  groups?: IGroup[];
}

export * from './table';
export * from './gallery';
export * from './board';
export * from './card';
