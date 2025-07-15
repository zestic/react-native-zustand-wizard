// Test setup file for integration tests
import '@testing-library/jest-native/extend-expect';

// Mock React Native modules that might not be available in test environment
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  // Mock any React Native components that might cause issues in tests
  RN.NativeModules = {
    ...RN.NativeModules,
  };

  return RN;
});

// Global test configuration
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
});

// Suppress console warnings in tests unless needed
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
});
