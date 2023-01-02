export * from './gallery.js';
import type { DataBaseViewType, IViewModel } from '../index.js';

export interface IGalleryViewModel extends IViewModel {
  type: DataBaseViewType.Gallery;
  width: number;
  height: number;
}
