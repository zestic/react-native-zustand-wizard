# Test Structure Documentation

This document explains the test structure for the react-native-zustand-wizard library.

## Directory Structure

```
react-native-zustand-wizard/
├── src/                           # Source code
│   ├── components/
│   │   ├── Wizard.tsx
│   │   └── Wizard.test.tsx        # Unit tests (co-located)
│   ├── utils/
│   │   ├── wizardUtils.ts
│   │   └── wizardUtils.test.ts    # Unit tests (co-located)
│   └── ...
├── test/                          # Integration tests (NEW)
│   ├── fixtures/
│   │   └── test-components.tsx    # Reusable test components
│   ├── integration/
│   │   ├── hooks-integration.test.tsx
│   │   ├── onComplete-integration.test.tsx
│   │   └── wizard-complete-flow.test.tsx
│   ├── setup.ts                   # Test setup configuration
│   └── README.md                  # This file
├── jest.config.js                 # Updated Jest configuration
└── tsconfig.json                  # Updated TypeScript configuration
```

## Test Types

### Unit Tests (in `src/`)

- **Location**: Co-located with source files (`*.test.ts` or `*.test.tsx`)
- **Purpose**: Test individual components, functions, and modules in isolation
- **Coverage**: Included in code coverage reports
- **Examples**:
  - `src/components/Wizard.test.tsx`
  - `src/utils/wizardUtils.test.ts`
  - `src/stores/WizardStore.test.ts`

### Integration Tests (in `test/`)

- **Location**: Separate `test/` directory
- **Purpose**: Test complete workflows and component interactions
- **Coverage**: Excluded from code coverage (test implementation, not library functionality)
- **Examples**:
  - `test/integration/hooks-integration.test.tsx` - Tests hook-based step components
  - `test/integration/onComplete-integration.test.tsx` - Tests wizard completion flow
  - `test/integration/wizard-complete-flow.test.tsx` - Tests complete navigation flows

### Test Fixtures (in `test/fixtures/`)

- **Location**: `test/fixtures/`
- **Purpose**: Reusable test components and utilities
- **Examples**:
  - `test-components.tsx` - Step components for testing different scenarios

## Configuration

### Jest Configuration (`jest.config.js`)

```javascript
module.exports = {
  // Test file patterns - include both unit and integration tests
  testMatch: [
    '<rootDir>/src/**/*.test.{ts,tsx}', // Unit tests
    '<rootDir>/test/**/*.test.{ts,tsx}', // Integration tests
  ],

  // Setup files
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/test/setup.ts', // Integration test setup
  ],

  // Exclude integration tests from coverage
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!test/**/*', // Exclude test directory
  ],
};
```

### TypeScript Configuration (`tsconfig.json`)

```json
{
  "include": ["src/**/*"],
  "exclude": [
    "test/**/*", // Exclude integration tests from build
    "**/*.test.ts",
    "**/*.test.tsx"
  ]
}
```

## Running Tests

### All Tests

```bash
yarn test
```

### Unit Tests Only

```bash
yarn test src/
```

### Integration Tests Only

```bash
yarn test test/
```

### Specific Test File

```bash
yarn test test/integration/hooks-integration.test.tsx
```

### With Coverage

```bash
yarn test --coverage
```

## Benefits of This Structure

### ✅ **Industry Standard**

- Follows TypeScript/React Native library conventions
- Matches expectations of most developers
- Compatible with standard tooling

### ✅ **Clean Builds**

- Integration tests excluded from published package
- Smaller bundle size
- No test code in production builds

### ✅ **Clear Separation**

- Unit tests: Test individual components in isolation
- Integration tests: Test complete workflows and interactions
- Fixtures: Reusable test utilities

### ✅ **Better Tooling**

- IDEs handle the structure correctly
- Coverage reports focus on source code
- Build tools exclude test files automatically

### ✅ **Maintainability**

- Easy to find and organize tests
- Clear distinction between test types
- Reusable test components in fixtures

## Test Guidelines

### Unit Tests

- Test individual functions/components in isolation
- Mock external dependencies
- Focus on edge cases and error conditions
- Maintain high coverage (80%+ statements/functions, 70%+ branches)

### Integration Tests

- Test real component interactions
- Use minimal mocking
- Test complete user workflows
- Focus on behavior rather than implementation

### Test Components (Fixtures)

- Create reusable step components for different scenarios
- Keep them simple and focused
- Document their purpose and usage
- Use descriptive names and test IDs

## Migration Notes

This structure was migrated from the previous `src/integration/` approach to follow industry standards. The migration included:

1. **Moved integration tests** from `src/integration/` to `test/integration/`
2. **Updated Jest configuration** to handle both test locations
3. **Updated TypeScript configuration** to exclude test files from builds
4. **Created test fixtures** for reusable test components
5. **Added test setup** for integration test configuration

All existing unit tests remain in their original locations and continue to work as before.
