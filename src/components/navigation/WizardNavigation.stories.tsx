import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { WizardNavigation } from './WizardNavigation';
import { WizardStore } from '../../stores/WizardStore';
import { StepIndicator } from './StepIndicator';
import { useNavigationContext } from '../../utils/wizardUtils';

// Custom button component for stories
const CustomButton = ({
  onPress,
  title,
  disabled,
  testID,
}: {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  testID?: string;
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={[styles.customButton, disabled && styles.disabledButton]}
    testID={testID}
  >
    <Text style={[styles.buttonText, disabled && styles.disabledText]}>
      {title}
    </Text>
  </TouchableOpacity>
);

// Custom step indicator component for stories
const CustomStepIndicator = () => {
  const { currentStepPosition, totalSteps } = useNavigationContext();

  return (
    <View style={styles.stepIndicator}>
      <Text style={styles.stepText}>
        Step {currentStepPosition} of {totalSteps}
      </Text>
    </View>
  );
};

// Create a mock store with 3 steps
const createMockStore = () => {
  const steps = [
    { id: 'step1', order: 1, canMoveNext: true, nextLabel: 'Next' },
    {
      id: 'step2',
      order: 2,
      canMoveNext: true,
      nextLabel: 'Next',
      previousLabel: 'Previous',
    },
    {
      id: 'step3',
      order: 3,
      canMoveNext: true,
      nextLabel: 'Next',
      previousLabel: 'Previous',
    },
  ];
  return WizardStore.create({ steps });
};

const styles = StyleSheet.create({
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  customButton: {
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 5,
    minWidth: 100,
    padding: 10,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  disabledText: {
    color: '#666666',
  },
  stepIndicator: {
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    marginVertical: 10,
    padding: 10,
  },
  stepText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

const meta: Meta<typeof WizardNavigation> = {
  title: 'Navigation/WizardNavigation',
  component: WizardNavigation,
  decorators: [
    (Story) => (
      <View style={{ padding: 20, flex: 1, justifyContent: 'center' }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof WizardNavigation>;

// Basic story with default configuration
export const Default: Story = {
  args: {
    store: createMockStore(),
  },
};

// Story with custom button component
export const WithCustomButton: Story = {
  args: {
    store: createMockStore(),
    ButtonComponent: CustomButton,
  },
};

// Story with custom step indicator
export const WithCustomStepIndicator: Story = {
  args: {
    store: createMockStore(),
    StepIndicatorComponent: CustomStepIndicator,
  },
};

// Adapter for StepIndicator to match WizardNavigation's expected props
const StepIndicatorAdapter = ({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
  testID?: string;
}) => {
  // Create a mock store with the correct currentStepPosition and totalSteps
  const steps = Array.from({ length: totalSteps }, (_, i) => ({
    id: `step${i + 1}`,
    order: i + 1,
    canMoveNext: true,
  }));
  const store = WizardStore.create({
    currentStepId: `step${currentStep}`,
    currentStepPosition: currentStep,
    steps,
    stepData: {},
  });
  return <StepIndicator />;
};

// Story with step indicator above buttons
export const IndicatorAbove: Story = {
  args: {
    store: createMockStore(),
    StepIndicatorComponent: StepIndicatorAdapter,
    indicatorPosition: 'above',
  },
};

// Story with step indicator below buttons
export const IndicatorBelow: Story = {
  args: {
    store: createMockStore(),
    StepIndicatorComponent: StepIndicatorAdapter,
    indicatorPosition: 'below',
  },
};

// Story with step indicator between the buttons
export const IndicatorBetween: Story = {
  args: {
    store: createMockStore(),
    StepIndicatorComponent: StepIndicatorAdapter,
    indicatorPosition: 'between',
  },
};

// Story with all custom components
export const FullyCustomized: Story = {
  args: {
    store: createMockStore(),
    ButtonComponent: CustomButton,
    StepIndicatorComponent: CustomStepIndicator,
    indicatorPosition: 'between',
  },
};

// Story demonstrating navigation actions
export const WithNavigationActions: Story = {
  args: {
    store: createMockStore(),
  },
  render: (args) => {
    const store = createMockStore();
    return (
      <View>
        <Text style={{ marginBottom: 10 }}>
          Current Step: {store.currentStepPosition + 1}
        </Text>
        <WizardNavigation {...args} store={store} />
      </View>
    );
  },
};

// Story with disabled next button
export const WithDisabledNext: Story = {
  args: {
    store: (() => {
      const steps = [
        { id: 'step1', order: 1, canMoveNext: false, nextLabel: 'Next' },
        {
          id: 'step2',
          order: 2,
          canMoveNext: true,
          nextLabel: 'Next',
          previousLabel: 'Previous',
        },
        {
          id: 'step3',
          order: 3,
          canMoveNext: true,
          nextLabel: 'Next',
          previousLabel: 'Previous',
        },
      ];
      return WizardStore.create({ steps });
    })(),
  },
  render: (args) => {
    const store = args.store;
    return (
      <View>
        <Text style={{ marginBottom: 10 }}>
          Current Step: {store.currentStepPosition + 1}
        </Text>
        <Text style={{ marginBottom: 10 }}>
          Next button is disabled because canMoveNext is false
        </Text>
        <WizardNavigation {...args} store={store} />
      </View>
    );
  },
};
