module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],

  // Test file patterns - include both unit tests (in src/) and integration tests (in test/)
  testMatch: [
    '<rootDir>/src/**/*.test.{ts,tsx}',      // Unit tests co-located with source
    '<rootDir>/test/**/*.test.{ts,tsx}'      // Integration tests in test/ directory
  ],

  // Setup files
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/test/setup.ts'                // Integration test setup
  ],

  // Ignore patterns
  modulePathIgnorePatterns: ['<rootDir>/lib/'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/lib/',
    '<rootDir>/test/fixtures/'               // Don't run fixture files as tests
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/*.d.ts',
    '!src/index.ts',
    '!test/**/*',                            // Exclude integration tests from coverage
  ],
  coverageDirectory: './coverage',
  coverageReporters: ['lcov', 'text', 'html'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80,
    },
  },
};
