import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { colors } from '../../theme/colors';
import { WizardNavigation } from './WizardNavigation';
import { WizardStore } from '../../stores/WizardStore';
import { useNavigationContext } from '../../utils/wizardUtils';

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
  accessibilityState?: { disabled: boolean };
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onPress,
  title,
  disabled,
}) => (
  <View style={[styles.button, disabled && styles.buttonDisabled]}>
    <Text
      style={[styles.buttonText, disabled && styles.buttonTextDisabled]}
      onPress={onPress}
    >
      {title}
    </Text>
  </View>
);

const CustomStepIndicator: React.FC = () => {
  const { currentStepPosition, totalSteps } = useNavigationContext();
  return (
    <View style={styles.stepIndicator}>
      <Text>
        Step {currentStepPosition} of {totalSteps}
      </Text>
    </View>
  );
};

const createStore = (currentStepPosition = 1) => {
  const steps = [
    {
      id: 'step1',
      order: 1,
      canMoveNext: true,
      nextLabel: 'Next',
      previousLabel: 'Back',
    },
    {
      id: 'step2',
      order: 2,
      canMoveNext: true,
      nextLabel: 'Next',
      previousLabel: 'Back',
    },
    {
      id: 'step3',
      order: 3,
      canMoveNext: true,
      nextLabel: 'Finish',
      previousLabel: 'Back',
    },
  ];
  return WizardStore.create({
    currentStepId: `step${currentStepPosition}`,
    currentStepPosition,
    steps,
    stepData: {},
  });
};

export const Default = () => {
  createStore(2);
  return (
    <View style={styles.container}>
      <View style={styles.storyContainer}>
        <WizardNavigation />
      </View>
    </View>
  );
};

export const WithCustomButton = () => {
  createStore(2);
  return (
    <View style={styles.container}>
      <View style={styles.storyContainer}>
        <WizardNavigation ButtonComponent={CustomButton} />
      </View>
    </View>
  );
};

export const WithCustomStepIndicator = () => {
  createStore();

  return (
    <View style={styles.container}>
      <View style={styles.storyContainer}>
        <WizardNavigation StepIndicatorComponent={CustomStepIndicator} />
      </View>
    </View>
  );
};

export const IndicatorAbove = () => {
  createStore(2);

  return (
    <View style={styles.container}>
      <View style={styles.storyContainer}>
        <WizardNavigation indicatorPosition="above" />
      </View>
    </View>
  );
};

export const IndicatorBelow = () => {
  createStore(2);

  return (
    <View style={styles.container}>
      <View style={styles.storyContainer}>
        <WizardNavigation indicatorPosition="below" />
      </View>
    </View>
  );
};

export const IndicatorBetween = () => {
  createStore(2);

  return (
    <View style={styles.container}>
      <View style={styles.storyContainer}>
        <WizardNavigation indicatorPosition="between" />
      </View>
    </View>
  );
};

export const FullyCustomized = () => {
  createStore(2);

  return (
    <View style={styles.container}>
      <View style={styles.storyContainer}>
        <WizardNavigation
          ButtonComponent={CustomButton}
          StepIndicatorComponent={CustomStepIndicator}
          indicatorPosition="between"
        />
      </View>
    </View>
  );
};
