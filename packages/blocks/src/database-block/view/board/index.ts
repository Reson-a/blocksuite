export * from './board';
import type { DataBaseViewType, IViewModel } from '../index';

export interface IBoardViewModel extends IViewModel {
  type: DataBaseViewType.Board;
}
