import test from 'node:test';
import assert from 'node:assert/strict';
import { restoreProgress, nextPage, saveProgress } from '../public/state.js';
test('corrupt, missing, and out-of-range bookmarks safely start at the first page', () => {
  for (const raw of [null, 'bad json', '{}', '{"page":-2}', '{"page":99}', '{"page":1.2}', '{"page":"3"}']) {
    assert.equal(restoreProgress(raw, 8).page, 0);
  }
  assert.equal(restoreProgress('{"page":3,"favorite":true}', 8).page, 3);
});
test('page navigation clamps at both ends', () => {
  assert.equal(nextPage(0, -1, 8), 0);
  assert.equal(nextPage(7, 1, 8), 7);
  assert.equal(nextPage(2, 1, 8), 3);
});
test('blocked storage must not prevent reading', () => {
  assert.equal(saveProgress({setItem() {throw new Error('denied');}}, {page: 2}), false);
  let saved;
  assert.equal(saveProgress({setItem(k, v) {saved = JSON.parse(v);}}, {page: 2}), true);
  assert.equal(saved.page, 2);
});
