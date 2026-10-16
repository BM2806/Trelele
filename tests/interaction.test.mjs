import test from 'node:test';
import assert from 'node:assert/strict';
import { classifySwipe } from '../dist/interaction.mjs';
const swipe = (changes = {}) => classifySwipe({ dx: 120, dy: 10, width: 390, durationMs: 400, ...changes });

test('right and left horizontal drags classify distinct preferences', () => {
  assert.equal(swipe(), 'like');
  assert.equal(swipe({ dx: -120 }), 'pass');
});
test('taps and short fast flicks cannot become likes', () => {
  assert.equal(swipe({ dx: 0, dy: 0 }), 'cancel');
  assert.equal(swipe({ dx: 25, durationMs: 10 }), 'cancel');
});
test('vertical scrolling and steep diagonals cancel the preference', () => {
  assert.equal(swipe({ dx: 110, dy: 200 }), 'cancel');
  assert.equal(swipe({ dx: -120, dy: -100 }), 'cancel');
});
test('threshold follows card width with a 72 pixel floor', () => {
  assert.equal(swipe({ dx: 71, width: 240 }), 'cancel');
  assert.equal(swipe({ dx: 72, width: 240 }), 'like');
  assert.equal(swipe({ dx: 100, width: 480 }), 'cancel');
  assert.equal(swipe({ dx: 116, width: 480 }), 'like');
});
test('horizontal dominance must reach the configured ratio', () => {
  assert.equal(swipe({ dx: 134, dy: 100 }), 'cancel');
  assert.equal(swipe({ dx: 135, dy: 100 }), 'like');
});
test('invalid geometry and time fail closed', () => {
  for (const changes of [{ dx: NaN }, { dy: Infinity }, { width: 0 }, { width: -1 }, { durationMs: -1 }, { durationMs: undefined }]) {
    assert.equal(swipe(changes), 'cancel');
  }
});
test('duration alone never decides the preference', () => {
  assert.equal(swipe({ durationMs: 0 }), 'like');
  assert.equal(swipe({ durationMs: 30000 }), 'like');
  assert.equal(swipe({ dx: 5, durationMs: 30000 }), 'cancel');
});
