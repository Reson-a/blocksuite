import type { FilterType, IFilter, ISort } from '../utils/index.js';
import type { IGroup } from '../utils/group.js';

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

export * from './table/index.js';
export * from './gallery/index.js';
export * from './board/index.js';
export * from './card/index.js';
