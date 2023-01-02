export * from './board.js';
import type { DataBaseViewType, IViewModel } from '../index.js';

export interface IBoardViewModel extends IViewModel {
  type: DataBaseViewType.Board;
}
