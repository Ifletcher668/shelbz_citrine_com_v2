const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: __dirname });

/** @type {import('jest').Config} */
const customConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // Monorepo: root node_modules are hoisted — Jest must look there too
  moduleDirectories: ['node_modules', '<rootDir>/../node_modules'],
  moduleNameMapper: {
    // marked@17 ships ESM-only in frontend/node_modules; force the UMD build
    '^marked$': '<rootDir>/node_modules/marked/lib/marked.umd.js',
    // Always use our manual framer-motion mock (avoids jsdom layout API issues)
    '^framer-motion$': '<rootDir>/__mocks__/framer-motion.js',
    // strapi-typed-client is ESM-only; swap in a CJS stub for Jest
    '^strapi-typed-client$': '<rootDir>/__mocks__/strapi-typed-client.js',
  },
  // Only treat *.test.* and *.spec.* files as tests (fixtures.js lives in __tests__ dirs)
  testMatch: ['**/*.test.[jt]s?(x)', '**/*.spec.[jt]s?(x)'],
};

module.exports = createJestConfig(customConfig);
