import test from 'node:test';
import assert from 'node:assert/strict';
import { refreshAfterImages } from '../src/scripts/image-refresh.ts';

test('image bursts share a frame; cleanup cancels callbacks and listeners', () => {
  const originalRequest = globalThis.requestAnimationFrame;
  const originalCancel = globalThis.cancelAnimationFrame;
  const frames = new Map();
  let next = 0, refreshes = 0;
  globalThis.requestAnimationFrame = callback => { frames.set(++next, callback); return next; };
  globalThis.cancelAnimationFrame = id => frames.delete(id);
  const images = [false, false, false, true].map(complete => Object.assign(new EventTarget(), { complete }));
  try {
    const stop = refreshAfterImages({ querySelectorAll: () => images }, () => refreshes++);
    images[0].dispatchEvent(new Event('load'));
    images[1].dispatchEvent(new Event('load'));
    images[3].dispatchEvent(new Event('load')); // Cached images have no listener.
    assert.equal(frames.size, 1);
    assert.equal(refreshes, 0);
    const callback = [...frames.values()][0]; frames.clear(); callback();
    assert.equal(refreshes, 1);
    images[2].dispatchEvent(new Event('load'));
    assert.equal(frames.size, 1);
    stop();
    assert.equal(frames.size, 0);
    images.forEach(image => image.dispatchEvent(new Event('load')));
    assert.equal(frames.size, 0);
    assert.equal(refreshes, 1);
  } finally {
    globalThis.requestAnimationFrame = originalRequest;
    globalThis.cancelAnimationFrame = originalCancel;
  }
});
