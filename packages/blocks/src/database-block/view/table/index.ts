/**
 * @license
 *
 * Copyright IBM Corp. 2021
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import './table';
import './table-cell';
import './table-row';

import type { IViewModel } from '../index';

export interface ITableViewModel extends IViewModel {
  row: Record<string, IRowModel>;
  col: Record<string, IColModel>;
}

interface IRowModel {
  height: number;
}

interface IColModel {
  width: number;
}
