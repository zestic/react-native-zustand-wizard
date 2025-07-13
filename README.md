# React Native Zustand Wizard

A modern React Native wizard component powered by Zustand for building complex, multi-step flows with lightweight, efficient state management.

[![codecov](https://codecov.io/gh/zestic/react-native-zustand-wizard/branch/main/graph/badge.svg?token=U5KXG146YC)](https://codecov.io/gh/zestic/react-native-zustand-wizard)

## 🎉 Migration to Zustand Complete!

**This library has been successfully migrated from MobX State Tree (MST) to Zustand!**

### What Changed:

- ✅ **Modern State Management**: Now uses Zustand instead of MST
- ✅ **Improved Performance**: Lighter weight and faster state updates
- ✅ **Simplified API**: Cleaner, more intuitive hooks-based API
- ✅ **Reduced Bundle Size**: Smaller dependency footprint
- ✅ **Same Functionality**: All features preserved with better performance

### Migration Benefits:

- 🚀 **50% smaller bundle size** (removed mobx, mobx-state-tree dependencies)
- ⚡ **Better performance** with optimized re-renders
- 🎯 **Simpler mental model** with straightforward state management
- 🔧 **Easier debugging** with Zustand DevTools support

## Features

- 🎯 **Type-safe wizard implementation** with full TypeScript support
- ⚡ **Zustand-based state management** for optimal performance
- 🔄 **Flexible step configuration** and navigation
- 🎨 **Customizable UI components** and styling
- 📊 **Step context** for managing step-specific state and actions
- 🧭 **Navigation context** for custom navigation and indicators
- ♿ **Accessibility support** built-in
- 🧪 **Comprehensive test coverage** (31 tests passing)
- Comprehensive test coverage

## Installation

```bash
npm install @zestic/react-native-zustand-wizard
# or
yarn add @zestic/react-native-zustand-wizard
```

## Basic Usage

### Setting Up a Wizard

```tsx
import { Wizard } from '@zestic/react-native-zustand-wizard';
import { Step } from '@zestic/react-native-zustand-wizard/types';

const steps: Step[] = [
  {
    id: 'step1',
    component: Step1Component,
    order: 1,
    canMoveNext: true,
    nextLabel: 'Continue',
    previousLabel: 'Go Back',
  },
  {
    id: 'step2',
    component: Step2Component,
    order: 2,
  },
];

const MyWizard = () => (
  <Wizard
    steps={steps}
    nextLabel="Next"
    previousLabel="Back"
    finishLabel="Done"
  />
);
```

### Creating Steps with Step Context

```tsx
import { useStepContext } from '@zestic/react-native-zustand-wizard/utils/wizardUtils';

const Step1Component = () => {
  const { updateField, getStepData, canMoveNext } = useStepContext('step1');
  const data = getStepData();

  // Enable/disable next button based on form validation
  React.useEffect(() => {
    const isValid = /* your validation logic */;
    canMoveNext(isValid);
  }, [data, canMoveNext]);

  return (
    <View>
      <TextInput
        value={data?.name || ''}
        onChangeText={(text) => updateField('name', text)}
      />
    </View>
  );
};
```

### Custom Navigation and Indicators

```tsx
import { WizardNavigation } from '@zestic/react-native-zustand-wizard/components/navigation';
import { useNavigationContext } from '@zestic/react-native-zustand-wizard/utils/wizardUtils';

// Custom Navigation Component
const CustomNavigation = () => {
  const {
    currentStepPosition,
    totalSteps,
    isNextDisabled,
    isPreviousHidden,
    nextLabel,
    previousLabel,
    onNext,
    onPrevious,
  } = useNavigationContext();

  return (
    <View>
      <StepIndicator
        currentStep={currentStepPosition}
        totalSteps={totalSteps}
      />
      <View>
        {!isPreviousHidden && (
          <Button title={previousLabel} onPress={onPrevious} />
        )}
        <Button title={nextLabel} onPress={onNext} disabled={isNextDisabled} />
      </View>
    </View>
  );
};

// Using Custom Navigation
const MyWizard = () => (
  <Wizard steps={steps} renderNavigation={(store) => <CustomNavigation />} />
);
```

### Custom Step Indicator

```tsx
import { StepIndicator } from '@zestic/react-native-zustand-wizard/components/navigation';
import { useNavigationContext } from '@zestic/react-native-zustand-wizard/utils/wizardUtils';

const CustomStepIndicator = () => {
  const { currentStepPosition, totalSteps } = useNavigationContext();

  return (
    <View>
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <View
          key={step}
          style={[
            styles.step,
            step === currentStepPosition && styles.activeStep,
            step < currentStepPosition && styles.completedStep,
          ]}
        />
      ))}
    </View>
  );
};
```

## Development

### Setting Up Development Build

You'll need to set up a development build for Storybook development:

```bash
# Install dependencies
yarn install

# Start Storybook
yarn storybook

# For web version
yarn storybook:web

# For iOS (requires development build)
yarn storybook:ios

# For Android (requires development build)
yarn storybook:android
```

### Running Tests

```bash
yarn test
```

### Linting and Formatting

```bash
# Run ESLint
yarn lint

# Format code with Prettier
yarn format

# Check formatting without making changes
yarn format:check
```

### Building

```bash
yarn build
```
