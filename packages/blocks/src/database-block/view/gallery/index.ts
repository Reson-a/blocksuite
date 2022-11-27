export * from './card';
export * from './gallery';
import type { DataBaseViewType, IViewModel } from '../index';

export interface IGalleryViewModel extends IViewModel {
  type: DataBaseViewType.Gallery;
  width: number;
  height: number;
}
