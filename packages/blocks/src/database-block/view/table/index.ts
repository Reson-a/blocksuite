/**
 * @license
 *
 * Copyright IBM Corp. 2021
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

export * from './table.js';
export * from './table-cell.js';
export * from './table-row.js';
export * from './table-row-group.js';

import type { DataBaseViewType, IViewModel } from '../index.js';

export interface ITableViewModel extends IViewModel {
  type: DataBaseViewType.Table;
  row?: Record<string, IRowModel>;
  col?: Record<string, IColModel>;
}

interface IRowModel {
  height: number;
}

interface IColModel {
  width: number;
}
