# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.3] - 2024-07-13

### Added

- Comprehensive test coverage for all components and utilities
- Tests for Wizard component including loading states, error states, and custom navigation
- Tests for WizardNavigation component with different indicator positions and custom components
- Tests for WizardContext provider and hooks
- Tests for wizardUtils hooks (useStepContext, useNavigationContext)
- Tests for theme styles and type definitions
- Tests for utility exports and re-exports

### Changed

- Improved test coverage to meet 80% threshold requirements (statements, branches, functions, lines)
- Enhanced error handling in test scenarios
- Fixed infinite loop issue in WizardContext useEffect

## [0.1.2] - 2025-07-13

### Changed

- Remove all MST references from documentation and examples
- Clean up package dependencies
- Remove package-lock.json in favor of yarn.lock

## [0.1.1] - 2025-07-13

### Changed

- Change license from MIT to Apache 2.0
- Update package name to @zestic/react-native-zustand-wizard
- Fix TypeScript issues for npm publishing
- Update documentation and README

## [0.1.0] - 2025-07-13 - Initial Release

### Added

- Step-based navigation with customizable components
- Built-in accessibility support
- TypeScript support
- Comprehensive test suite
- Example application

## Technical Details

```
src/
├── components/
│   ├── Wizard.tsx              # Main wizard component
│   └── navigation/
│       ├── WizardNavigation.tsx # Navigation component
│       └── StepIndicator.tsx    # Step indicator component
├── context/
│   └── WizardContext.tsx       # React context provider
├── stores/
│   └── WizardStore.ts          # Zustand store implementation
├── utils/
│   ├── wizardUtils.ts          # Utility hooks
│   └── index.ts                # Utility exports
├── theme/
│   ├── colors.ts               # Color definitions
│   └── styles.ts               # Common styles
└── types/
    └── index.ts                # TypeScript definitions
```

### Test Coverage (Current)

- **Statements**: 80%+ (Target met)
- **Branches**: 70%+ (Target met)
- **Functions**: 80%+ (Target met)
- **Lines**: 80%+ (Target met)

### Dependencies (Current)

```json
{
  "zustand": "^5.0.6"
}
```

### Peer Dependencies

```json
{
  "react": ">=19.0.0",
  "react-native": ">=0.79.0",
  "zustand": ">=5.0.0"
}
```

## Usage Examples

### Basic Usage

```typescript
import { Wizard, useWizard, useStepContext } from '@zestic/react-native-zustand-wizard';

const MyWizard = () => {
  const steps = [
    { id: 'step1', component: Step1Component, order: 1 },
    { id: 'step2', component: Step2Component, order: 2 },
  ];

  return <Wizard steps={steps} />;
};
```

### Step Component

```typescript
const Step1Component = () => {
  const stepContext = useStepContext('step1');
  const store = useWizard();

  return (
    <View>
      <Text>Current Step: {store.currentStepId}</Text>
      <Button
        title="Update Field"
        onPress={() => stepContext.updateField('name', 'John')}
      />
    </View>
  );
};
```

### Navigation

```typescript
import { useNavigationContext } from '@zestic/react-native-zustand-wizard';

const CustomNavigation = () => {
  const navigation = useNavigationContext();

  return (
    <View>
      <Button title="Previous" onPress={navigation.onPrevious} />
      <Button title="Next" onPress={navigation.onNext} />
    </View>
  );
};
```

## Performance Features

- **Selective Re-renders**: Components only re-render when relevant state changes
- **Optimized Bundle Size**: Lightweight Zustand-based state management
- **Better Tree Shaking**: Improved dead code elimination
- **Async Operations**: Proper handling of async step transitions
- **Memory Efficient**: Simple state structure with minimal overhead

## Compatibility

### React Native Versions

- **Minimum**: React Native 0.79.0
- **Tested**: React Native 0.79.5
- **Recommended**: React Native 0.79.0+

### React Versions

- **Minimum**: React 19.0.0
- **Tested**: React 19.0.0
- **Recommended**: React 19.0.0+

### Expo Versions

- **Supported**: Expo SDK 53
- **Tested**: Expo 53.0.19

## Contributing

### Development Setup

```bash
# Install dependencies
yarn install

# Run tests
yarn test

# Run tests with coverage
yarn test:coverage

# Type checking
yarn typescript

# Linting
yarn lint
```

### Testing Requirements

- All new features must include comprehensive tests
- Maintain minimum 80% code coverage
- Test both happy path and error scenarios
- Include accessibility testing where applicable

## License

Apache License 2.0 - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- Zustand team for the excellent state management library
- React Native community for continuous support and feedback
- Contributors and users who help improve this library
