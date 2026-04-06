// Augment Jest matchers with @testing-library/jest-dom custom matchers.
// This file is picked up by tsconfig's include: ["**/*.ts"] so tsc knows
// about toBeInTheDocument(), toHaveLength(), etc. in .test.tsx files.
import '@testing-library/jest-dom';
