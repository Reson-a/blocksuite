// manual import to avoid being tree-shaked
import './page-block';
import './counter-block';
import './paragraph-block';
import './list-block';
import './group-block';
import './divider-block';
import './__internal__/rich-text/link-node';
import './embed-block';
import './embed-block/image';
export * from './counter-block/index.js';
export * from './embed-block/index.js';
export * from './paragraph-block/index.js';
export * from './page-block/index.js';
export * from './list-block/index.js';
export * from './group-block/index.js';
export * from './code-block/index.js';
export * from './divider-block/index.js';
export * from './embed-block/image/index.js';
export * from './shape-block/index.js';
export * as SelectionUtils from './__internal__/utils/selection.js';
export * from './__internal__/utils/types.js';
export * from './__internal__/utils/common-operations.js';
export * from './__internal__/utils/std.js';
export * from './__internal__/utils/query.js';
export * from './__internal__/utils/shape.js';
export * from './__internal__/utils/lit.js';

const env: Record<string, unknown> =
  typeof globalThis !== 'undefined'
    ? globalThis
    : typeof window !== 'undefined'
    ? window
    : typeof global !== 'undefined'
    ? global
    : {};
const importIdentifier = '__ $BLOCKSUITE_BLOCKS$ __';

if (env[importIdentifier] === true) {
  // https://github.com/yjs/yjs/issues/438
  console.error(
    '@blocksuite/blocks was already imported. This breaks constructor checks and will lead to issues!'
  );
}

env[importIdentifier] = true;
