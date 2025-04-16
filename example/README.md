# MST Wizard Example

This example demonstrates how to use the MST Wizard library to create a multi-step registration form with MobX-State-Tree for state management.

## Features

- Type-safe state management with MobX-State-Tree
- Reactive UI updates
- Step validation
- Error handling
- Centralized data collection
- Step ordering
- Data preloading

## Project Structure

```
example/
├── components/
│   ├── RegistrationWizard.tsx
│   └── steps/
│       ├── PersonalInfoStep.tsx
│       ├── ContactInfoStep.tsx
│       ├── SecurityStep.tsx
│       ├── PreferencesStep.tsx
│       └── ReviewStep.tsx
├── App.tsx
└── README.md
```

## How to Use the Wizard

### 1. Define Step Components

Each step component should:
- Accept `store` and `onComplete` props
- Use the `useStepContext` hook to access the store and helper functions
- Implement validation logic
- Call `onComplete` when the step is finished

Example:

```tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react-lite';
import { WizardStoreType } from '../../../src/types/store';
import { useStepContext } from '../../../src/utils/wizardUtils';

// Define validation function
const validateStep = (data: any) => {
  const errors: Record<string, string> = {};
  
  if (!data.field) {
    errors.field = 'Field is required';
  }
  
  return errors;
};

interface StepProps {
  store: WizardStoreType;
  onComplete: () => void;
}

export const StepComponent: React.FC<StepProps> = observer(({ store, onComplete }) => {
  // Use the step context hook
  const { updateField, getStepData } = useStepContext('stepId', store);
  
  // Get the current step data
  const stepData = getStepData();
  
  // State for validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Validate the form when data changes
  useEffect(() => {
    const validationErrors = validateStep(stepData);
    setErrors(validationErrors);
  }, [stepData]);
  
  // Handle form submission
  const handleSubmit = () => {
    const validationErrors = validateStep(stepData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      onComplete();
    }
  };
  
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, errors.field && styles.inputError]}
        value={stepData.field || ''}
        onChangeText={(value) => updateField('field', value)}
        placeholder="Enter value"
      />
      {errors.field && <Text style={styles.errorText}>{errors.field}</Text>}
      
      <TouchableOpacity
        style={[styles.button, Object.keys(errors).length > 0 && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={Object.keys(errors).length > 0}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
});
```

### 2. Create a Wizard Component

Create a component that defines the steps and uses the `Wizard` component:

```tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { observer } from 'mobx-react-lite';
import { Wizard } from '../../src/components/Wizard';
import { WizardStore } from '../../src/stores/WizardStore';
import { setWizardUtilsStore } from '../../src/utils/wizardUtils';
import { StepConfig } from '../../src/types';

// Import step components
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { ContactInfoStep } from './steps/ContactInfoStep';
import { SecurityStep } from './steps/SecurityStep';
import { PreferencesStep } from './steps/PreferencesStep';
import { ReviewStep } from './steps/ReviewStep';

interface RegistrationWizardProps {
  onComplete?: (data: any) => void;
  preloadData?: boolean;
}

const RegistrationWizard: React.FC<RegistrationWizardProps> = observer(({ 
  onComplete,
  preloadData = false
}) => {
  const [isLoading, setIsLoading] = useState(preloadData);
  const [isPreloaded, setIsPreloaded] = useState(false);
  
  // Define the steps for the wizard with proper typing
  const steps: StepConfig[] = [
    {
      id: 'personalInfo',
      title: 'Personal Information',
      component: PersonalInfoStep,
      order: 1
    },
    {
      id: 'contactInfo',
      title: 'Contact Information',
      component: ContactInfoStep,
      order: 2
    },
    {
      id: 'security',
      title: 'Security',
      component: SecurityStep,
      order: 3
    },
    {
      id: 'preferences',
      title: 'Preferences',
      component: PreferencesStep,
      order: 4
    },
    {
      id: 'review',
      title: 'Review',
      component: ReviewStep,
      order: 5
    }
  ];
  
  // Sort steps by order
  const sortedSteps = [...steps].sort((a, b) => (a.order || 0) - (b.order || 0));
  
  // Create a store instance
  const store = WizardStore.create({
    currentStepId: sortedSteps[0].id,
    steps: sortedSteps,
    stepData: {},
    isLoading: false
  });
  
  // Initialize the wizard store for the utility function
  setWizardUtilsStore(store);
  
  // Preload data if needed
  useEffect(() => {
    if (preloadData && !isPreloaded) {
      const preloadWizardData = async () => {
        try {
          // Simulate API call to fetch initial data
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Set some initial data for each step
          store.updateField('personalInfo', 'firstName', 'John');
          store.updateField('personalInfo', 'lastName', 'Doe');
          store.updateField('personalInfo', 'dateOfBirth', new Date('1990-01-01'));
          
          store.updateField('contactInfo', 'email', 'john.doe@example.com');
          store.updateField('contactInfo', 'phone', '123-456-7890');
          store.updateField('contactInfo', 'address', '123 Main St');
          store.updateField('contactInfo', 'city', 'Anytown');
          store.updateField('contactInfo', 'state', 'CA');
          store.updateField('contactInfo', 'zipCode', '12345');
          
          store.updateField('preferences', 'language', 'en');
          store.updateField('preferences', 'theme', 'light');
          store.updateField('preferences', 'newsletter', true);
          store.updateField('preferences', 'marketing', false);
          
          setIsPreloaded(true);
          setIsLoading(false);
        } catch (error) {
          Alert.alert('Error', 'Failed to preload data. Please try again.');
          setIsLoading(false);
        }
      };
      
      preloadWizardData();
    }
  }, [preloadData, isPreloaded, store]);
  
  const handleComplete = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get all wizard data in a single call
      const registrationData = store.getWizardData();
      
      // Call the onComplete callback with the collected data
      if (onComplete) {
        onComplete(registrationData);
      } else {
        Alert.alert('Registration Complete', 'Your account has been created successfully!');
      }
      
      // Reset the store for future use
      store.reset();
    } catch (error) {
      Alert.alert('Error', 'Failed to complete registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Wizard
        store={store}
        isLoading={isLoading}
      />
    </View>
  );
});
```

### 3. Use the Wizard in Your App

```tsx
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import RegistrationWizard from './components/RegistrationWizard';

const App = () => {
  const handleComplete = (data: any) => {
    console.log('Registration data:', data);
    // Handle the registration data
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <RegistrationWizard 
        onComplete={handleComplete} 
        preloadData={true} // Set to true to preload data
      />
    </SafeAreaView>
  );
};
```

## Using MST Directly in Step Components

The example demonstrates how to use MST directly in step components, which provides several benefits:

1. **Simplified Code**: No need to define local state or update functions in each component
2. **Improved Reactivity**: Changes to the store automatically update the UI
3. **Centralized State**: All wizard data is stored in a single location

### The `updateField` Method

The `WizardStore` provides an `updateField` method that can be used to update individual fields in the step data:

```tsx
// Before
store.updateField('stepId', 'fieldName', value);

// After using useStepContext
const { updateField } = useStepContext('stepId', store);
updateField('fieldName', value);
```

This method is used in each step component to update the form fields, making the code more concise and easier to maintain.

### Collecting All Wizard Data

The `WizardStore` provides a `getWizardData` method that can be used to collect all step data in a single call:

```tsx
// Before
const personalInfo = store.getStepData('personalInfo');
const contactInfo = store.getStepData('contactInfo');
const security = store.getStepData('security');
const preferences = store.getStepData('preferences');

// After
const wizardData = store.getWizardData();
```

This method returns an object containing all step data, making it easy to collect and use the data when completing the wizard.

## Step Ordering

The wizard supports step ordering through the `order` property in the `StepConfig` interface:

```tsx
const steps: StepConfig[] = [
  {
    id: 'personalInfo',
    title: 'Personal Information',
    component: PersonalInfoStep,
    order: 1
  },
  {
    id: 'contactInfo',
    title: 'Contact Information',
    component: ContactInfoStep,
    order: 2
  },
  // ...
];

// Sort steps by order
const sortedSteps = [...steps].sort((a, b) => (a.order || 0) - (b.order || 0));
```

This allows you to:
- Define steps in any order in your code
- Ensure they are displayed in the correct sequence
- Easily reorder steps by changing the `order` property
- Add new steps without worrying about their position in the array

## Data Preloading

The wizard supports preloading data for testing or when editing existing data:

```tsx
<RegistrationWizard 
  onComplete={handleComplete} 
  preloadData={true} // Set to true to preload data
/>
```

When `preloadData` is set to `true`, the wizard will:
1. Show a loading indicator
2. Simulate an API call to fetch initial data
3. Populate the wizard with the fetched data
4. Display the wizard with the preloaded data

This is useful for:
- Testing the wizard with realistic data
- Editing existing user data
- Creating a consistent demo experience

## Form Validation

The example demonstrates how to implement form validation in each step component:

1. **Define a Validation Function**: Each step component has a validation function that checks the step data and returns an object of errors.

```tsx
const validateStep = (data: any) => {
  const errors: Record<string, string> = {};
  
  if (!data.field) {
    errors.field = 'Field is required';
  }
  
  return errors;
};
```

2. **Track Validation Errors**: Each step component maintains a state for validation errors.

```tsx
const [errors, setErrors] = useState<Record<string, string>>({});
```

3. **Validate on Data Changes**: The validation function is called whenever the step data changes.

```tsx
useEffect(() => {
  const validationErrors = validateStep(stepData);
  setErrors(validationErrors);
}, [stepData]);
```

4. **Display Validation Errors**: Validation errors are displayed below each field.

```tsx
{errors.field && <Text style={styles.errorText}>{errors.field}</Text>}
```

5. **Disable Submit Button**: The submit button is disabled if there are validation errors.

```tsx
<TouchableOpacity
  style={[styles.button, Object.keys(errors).length > 0 && styles.buttonDisabled]}
  onPress={handleSubmit}
  disabled={Object.keys(errors).length > 0}
>
  <Text style={styles.buttonText}>Continue</Text>
</TouchableOpacity>
```

### Validation Approach

The validation is handled entirely within each step component, which provides several benefits:

1. **Encapsulation**: Each step component is responsible for validating its own data
2. **Reusability**: Step components can be reused in different wizards without modification
3. **Maintainability**: Changes to validation logic only need to be made in one place
4. **User Experience**: Validation errors are displayed immediately as the user types

This approach eliminates the need for validation logic in the wizard component itself, making the code more modular and easier to maintain.

## Customization

The wizard can be customized by:

1. **Changing the Steps**: Add, remove, or reorder steps in the `steps` array.
2. **Modifying the UI**: Update the styles and layout of the step components.
3. **Adding Validation**: Implement more complex validation logic in each step component.
4. **Handling Completion**: Customize the `handleComplete` function to handle the wizard completion.
5. **Preloading Data**: Set the `preloadData` prop to `true` to preload data for testing or editing.

## Benefits of Using MST

- **Type Safety**: MST provides type safety for your state, making it easier to catch errors at compile time.
- **Reactivity**: MST automatically updates the UI when the state changes.
- **Immutability**: MST ensures that state changes are immutable, making it easier to track changes and debug.
- **DevTools**: MST integrates with Redux DevTools, making it easier to debug your application. 