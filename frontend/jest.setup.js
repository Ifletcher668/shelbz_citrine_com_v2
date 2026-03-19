import '@testing-library/jest-dom';

// Radix accordion uses ResizeObserver internally; jsdom doesn't ship it
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
