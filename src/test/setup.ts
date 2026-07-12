import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  localStorage.clear();
});

// jsdom lacks crypto.randomUUID; provide a deterministic stub.
if (!('randomUUID' in crypto)) {
  Object.defineProperty(crypto, 'randomUUID', {
    value: vi.fn(() => 'test-uuid-' + Math.random().toString(36).slice(2)),
    configurable: true,
  });
}

// jsdom does not implement scrollTo; no-op it so useEffect doesn't throw.
if (!Element.prototype.scrollTo) {
  Element.prototype.scrollTo = vi.fn(() => {});
}
