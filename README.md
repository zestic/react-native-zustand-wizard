# React Native MST Wizard

A React Native wizard component powered by MobX-State-Tree (MST) for building complex, multi-step flows with robust state management.

## Features

- Type-safe wizard implementation with full TypeScript support
- MST-based state management for complex wizard flows
- Flexible step configuration and navigation
- Built-in transition animations
- Customizable UI components
- Step context for managing step-specific state and actions
- Navigation context for custom navigation and indicators
- Comprehensive test coverage

## Installation

```bash
npm install react-native-mst-wizard
# or
yarn add react-native-mst-wizard
```

## Basic Usage

### Setting Up a Wizard

```tsx
import { Wizard } from 'react-native-mst-wizard';
import { Step } from 'react-native-mst-wizard/types';

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
import { observer } from 'mobx-react-lite';
import { useStepContext } from 'react-native-mst-wizard/utils/wizardUtils';

const Step1Component = observer(() => {
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
});
```

### Custom Navigation and Indicators

```tsx
import { WizardNavigation } from 'react-native-mst-wizard/components/navigation';
import { useNavigationContext } from 'react-native-mst-wizard/utils/wizardUtils';

// Custom Navigation Component
const CustomNavigation = observer(() => {
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
});

// Using Custom Navigation
const MyWizard = () => (
  <Wizard steps={steps} renderNavigation={(store) => <CustomNavigation />} />
);
```

### Custom Step Indicator

```tsx
import { StepIndicator } from 'react-native-mst-wizard/components/navigation';
import { useNavigationContext } from 'react-native-mst-wizard/utils/wizardUtils';

const CustomStepIndicator = observer(() => {
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
});
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
