import './utils/declare-test-window.js';
import { test } from '@playwright/test';
import {
  enterPlaygroundRoom,
  disconnectByClick,
  redoByClick,
  redoByKeyboard,
  undoByClick,
  undoByKeyboard,
  focusRichText,
  waitDefaultPageLoaded,
  pressEnter,
  addGroupByClick,
  initEmptyParagraphState,
} from './utils/actions/index.js';
import {
  defaultStore,
  assertBlockChildrenIds,
  assertEmpty,
  assertStore,
  assertText,
  assertRichTexts,
  assertTitle,
} from './utils/asserts.js';

test('basic input', async ({ page }) => {
  await enterPlaygroundRoom(page);
  await initEmptyParagraphState(page);
  await focusRichText(page);
  await page.keyboard.type('hello');

  await test.expect(page).toHaveTitle(/BlockSuite/);
  await assertStore(page, defaultStore);
  await assertText(page, 'hello');
});

test('basic init with external text', async ({ page }) => {
  await enterPlaygroundRoom(page);

  await page.evaluate(() => {
    const { page } = window;
    const pageId = page.addBlock({ flavour: 'affine:page', title: 'hello' });
    const groupId = page.addBlock({ flavour: 'affine:group' }, pageId);

    const text = new page.Text(page, 'world');
    page.addBlock({ flavour: 'affine:paragraph', text }, groupId);

    const delta = [
      { insert: 'foo ' },
      { insert: 'bar', attributes: { bold: true } },
    ];
    page.addBlock(
      {
        flavour: 'affine:paragraph',
        text: page.Text.fromDelta(page, delta),
      },
      groupId
    );
  });

  await assertTitle(page, 'hello');
  await assertRichTexts(page, ['world', 'foo bar']);
});

test('basic multi user state', async ({ browser, page: pageA }) => {
  const room = await enterPlaygroundRoom(pageA);
  await initEmptyParagraphState(pageA);
  await pageA.keyboard.type('hello');

  const pageB = await browser.newPage();
  await enterPlaygroundRoom(pageB, room);
  await waitDefaultPageLoaded(pageB);
  await assertTitle(pageB, 'hello');

  await pageB.keyboard.type(' world');
  await assertTitle(pageA, 'hello world');
});

test('A open and edit, then joins B', async ({ browser, page: pageA }) => {
  const room = await enterPlaygroundRoom(pageA);
  await initEmptyParagraphState(pageA);
  await focusRichText(pageA);
  await pageA.keyboard.type('hello');

  const pageB = await browser.newPage();
  await enterPlaygroundRoom(pageB, room);

  // wait until pageB content updated
  await assertText(pageB, 'hello');
  await Promise.all([
    assertText(pageA, 'hello'),
    assertStore(pageA, defaultStore),
    assertStore(pageB, defaultStore),
    assertBlockChildrenIds(pageA, '0', ['1']),
    assertBlockChildrenIds(pageB, '0', ['1']),
  ]);
});

test('A first open, B first edit', async ({ browser, page: pageA }) => {
  const room = await enterPlaygroundRoom(pageA);
  await initEmptyParagraphState(pageA);
  await focusRichText(pageA);

  const pageB = await browser.newPage();
  await enterPlaygroundRoom(pageB, room);
  await focusRichText(pageB);
  await pageB.keyboard.type('hello');

  // wait until pageA content updated
  await assertText(pageA, 'hello');
  await Promise.all([
    assertText(pageB, 'hello'),
    assertStore(pageA, defaultStore),
    assertStore(pageB, defaultStore),
  ]);
});

test('does not sync when disconnected', async ({ browser, page: pageA }) => {
  test.fail();

  const room = await enterPlaygroundRoom(pageA);
  const pageB = await browser.newPage();
  await enterPlaygroundRoom(pageB, room);

  await disconnectByClick(pageA);
  await disconnectByClick(pageB);

  // click together, both init with default id should lead to conflicts
  await initEmptyParagraphState(pageA);
  await initEmptyParagraphState(pageB);
  await focusRichText(pageA);
  await focusRichText(pageB);
  await pageA.keyboard.type('');
  await pageB.keyboard.type('');

  await pageA.keyboard.type('hello');

  await assertText(pageB, 'hello');
  await assertText(pageA, 'hello'); // actually '\n'
});

test('basic paired undo/redo', async ({ page }) => {
  await enterPlaygroundRoom(page);
  await initEmptyParagraphState(page);
  await focusRichText(page);
  await page.keyboard.type('hello');

  await assertText(page, 'hello');
  await undoByKeyboard(page);
  await assertEmpty(page);
  await redoByKeyboard(page);
  await assertText(page, 'hello');

  await undoByKeyboard(page);
  await assertEmpty(page);
  await redoByKeyboard(page);
  await assertText(page, 'hello');
});

test('undo/redo with keyboard', async ({ page }) => {
  await enterPlaygroundRoom(page);
  await initEmptyParagraphState(page);
  await focusRichText(page);
  await page.keyboard.type('hello');

  await assertText(page, 'hello');
  await undoByKeyboard(page);
  await assertEmpty(page);
  await redoByClick(page);
  await assertText(page, 'hello');
});

test('undo after adding block twice', async ({ page }) => {
  await enterPlaygroundRoom(page);
  await initEmptyParagraphState(page);

  await focusRichText(page);
  await page.keyboard.type('hello');
  await pressEnter(page);
  await page.keyboard.type('world');

  await undoByKeyboard(page);
  await assertRichTexts(page, ['hello']);
  await redoByKeyboard(page);
  await assertRichTexts(page, ['hello', 'world']);
});

test('undo/redo twice after adding block twice', async ({ page }) => {
  await enterPlaygroundRoom(page);
  await initEmptyParagraphState(page);
  await focusRichText(page);
  await page.keyboard.type('hello');
  await pressEnter(page);
  await page.keyboard.type('world');
  await assertRichTexts(page, ['hello', 'world']);

  await undoByKeyboard(page);
  await assertRichTexts(page, ['hello']);

  await undoByKeyboard(page);
  await assertRichTexts(page, ['\n']);

  await redoByClick(page);
  await assertRichTexts(page, ['hello']);

  await redoByKeyboard(page);
  await assertRichTexts(page, ['hello', 'world']);
});

test('undo multi groups', async ({ page }) => {
  await enterPlaygroundRoom(page);
  await initEmptyParagraphState(page);
  await focusRichText(page);
  await addGroupByClick(page);
  await assertRichTexts(page, ['\n', '\n']);

  await undoByClick(page);
  await assertRichTexts(page, ['\n']);

  await redoByClick(page);
  await assertRichTexts(page, ['\n', '\n']);
});
