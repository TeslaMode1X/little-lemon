import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Some Node versions (22+) expose an incomplete global localStorage that
// shadows jsdom's. Use a simple in-memory implementation so tests behave the
// same on every Node version.
const createStorage = () => {
  let store = {};
  return {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
    key: (i) => Object.keys(store)[i] ?? null,
    get length() { return Object.keys(store).length; },
  };
};
Object.defineProperty(window, 'localStorage', { value: createStorage(), configurable: true });

// jsdom doesn't implement scrolling.
window.scrollTo = () => {};

// Unmount rendered components and reset storage between tests.
afterEach(() => {
  cleanup();
  window.localStorage.clear();
});
