module.exports = {
  clearMocks: true,
  testPathIgnorePatterns: ['/node_modules/', '__generated__'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|ts|tsx)?$': [
      '@swc/jest',
      {
        sourceMaps: true,
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
          experimental: {
            plugins: [
              [
                '@swc/plugin-relay',
                {
                  rootDir: __dirname,
                  language: 'typescript',
                },
              ],
            ],
          },
        },
      },
    ],
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(j|t)s?sx?$',
  moduleFileExtensions: ['js', 'css', 'ts', 'tsx', 'json'],
  moduleDirectories: ['node_modules', 'src'],
  rootDir: './',
  cacheDirectory: '.jest-cache',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  cacheDirectory: '.jest-cache',
};
