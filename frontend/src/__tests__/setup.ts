import '@testing-library/jest-dom'
import { vi } from 'vitest';

// Polyfill DOMMatrix
vi.stubGlobal('DOMMatrix', class {
  constructor() {}
});
