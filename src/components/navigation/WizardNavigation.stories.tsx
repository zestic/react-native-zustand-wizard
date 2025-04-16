import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { colors } from '../../theme/colors';
import { WizardNavigation } from './WizardNavigation';
import { WizardStore } from '../../stores/WizardStore';

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    minWidth: 80,
    padding: 12,
  },
  buttonDisabled: {
    backgroundColor: colors.gray200,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextDisabled: {
    color: colors.gray400,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  stepIndicator: {
    alignItems: 'center',
    backgroundColor: colors.gray100,
    borderRadius: 8,
    padding: 8,
  },
  storyContainer: {
    marginBottom: 10,
  },
});

export default {
  title: 'Components/WizardNavigation',
  component: WizardNavigation,
};

interface CustomButtonProps {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  testID?: string;
  accessibilityState?: { disabled: boolean };
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onPress,
  title,
  disabled,
  testID,
}) => (
  <View
    style={[styles.button, disabled && styles.buttonDisabled]}
    testID={testID}
  >
    <Text
      style={[styles.buttonText, disabled && styles.buttonTextDisabled]}
      onPress={onPress}
    >
      {title}
    </Text>
  </View>
);

interface CustomStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  testID?: string;
}

const CustomStepIndicator: React.FC<CustomStepIndicatorProps> = ({
  currentStep,
  totalSteps,
  testID,
}) => (
  <View style={styles.stepIndicator} testID={testID}>
    <Text>
      Step {currentStep} of {totalSteps}
    </Text>
  </View>
);

export const Default = () => {
  const store = WizardStore.create();
  return (
    <View style={styles.container}>
      <View style={styles.storyContainer}>
        <WizardNavigation store={store} />
      </View>
    </View>
  );
};

export const WithCustomButton = () => {
  const store = WizardStore.create();
  return (
    <View style={styles.container}>
      <View style={styles.storyContainer}>
        <WizardNavigation store={store} ButtonComponent={CustomButton} />
      </View>
    </View>
  );
};

export const WithCustomStepIndicator = () => {
  const store = WizardStore.create();
  return (
    <View style={styles.container}>
      <View style={styles.storyContainer}>
        <WizardNavigation
          store={store}
          StepIndicatorComponent={CustomStepIndicator}
        />
      </View>
    </View>
  );
};

export const IndicatorAbove = () => {
  const store = WizardStore.create();
  return (
    <View style={styles.container}>
      <View style={styles.storyContainer}>
        <WizardNavigation store={store} indicatorPosition="above" />
      </View>
    </View>
  );
};

export const IndicatorBelow = () => {
  const store = WizardStore.create();
  return (
    <View style={styles.container}>
      <View style={styles.storyContainer}>
        <WizardNavigation store={store} indicatorPosition="below" />
      </View>
    </View>
  );
};

export const IndicatorBetween = () => {
  const store = WizardStore.create();
  return (
    <View style={styles.container}>
      <View style={styles.storyContainer}>
        <WizardNavigation store={store} indicatorPosition="between" />
      </View>
    </View>
  );
};

export const FullyCustomized = () => {
  const store = WizardStore.create();
  return (
    <View style={styles.container}>
      <View style={styles.storyContainer}>
        <WizardNavigation
          store={store}
          ButtonComponent={CustomButton}
          StepIndicatorComponent={CustomStepIndicator}
          indicatorPosition="between"
        />
      </View>
    </View>
  );
};
