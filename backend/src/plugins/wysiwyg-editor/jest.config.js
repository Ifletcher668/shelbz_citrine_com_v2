/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  roots: ['<rootDir>/admin/src'],
  transform: {
    '^.+\\.[jt]sx?$': [
      'babel-jest',
      {
        plugins: [
          '@babel/plugin-transform-modules-commonjs',
          '@babel/plugin-syntax-jsx',
        ],
      },
    ],
  },
  // marked ships as ESM — force the CJS entry so Jest (CommonJS) can require it
  moduleNameMapper: {
    '^marked$': '<rootDir>/../../../../node_modules/marked/lib/marked.cjs',
  },
  moduleDirectories: ['node_modules', '<rootDir>/../../../../node_modules'],
  transformIgnorePatterns: ['/node_modules/(?!marked/)'],
};
