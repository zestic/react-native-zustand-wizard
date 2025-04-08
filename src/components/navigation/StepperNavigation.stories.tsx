import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { StepperNavigation } from './StepperNavigation';
import { WizardStore } from '../../stores/WizardStore';

const meta = {
  title: 'Navigation/StepperNavigation',
  component: StepperNavigation,
};

export default meta;

const createStore = (steps = [
  { id: 'step1', title: 'Step 1', component: () => null },
  { id: 'step2', title: 'Step 2', hidden: true, component: () => null },
  { id: 'step3', title: 'Step 3', component: () => null }
]) => {
  return WizardStore.create({
    currentStepId: 'step1',
    completedSteps: [],
    steps,
    stepData: {}
  });
};

export const Default = () => {
  const store = createStore();
  return (
    <View style={styles.container}>
      <StepperNavigation store={store} />
    </View>
  );
};

export const WithHiddenSteps = () => {
  const store = createStore([
    { id: 'step1', title: 'Step 1', component: () => null },
    { id: 'step2', title: 'Step 2', hidden: true, component: () => null },
    { id: 'step3', title: 'Step 3', component: () => null },
    { id: 'step4', title: 'Step 4', hidden: true, component: () => null },
    { id: 'step5', title: 'Step 5', component: () => null }
  ]);
  return (
    <View style={styles.container}>
      <StepperNavigation store={store} />
    </View>
  );
};

export const WithCustomComponents = () => {
  const store = createStore();
  const CustomStep = ({ index, isCompleted, isCurrent }: { index: number; isCompleted: boolean; isCurrent: boolean }) => (
    <View
      style={[
        styles.customStep,
        isCompleted && styles.completedStep,
        isCurrent && styles.currentStep
      ]}
    >
      <Text style={styles.stepContent}>
        {isCompleted ? '✓' : index + 1}
      </Text>
    </View>
  );

  const CustomConnector = ({ isCompleted }: { isCompleted: boolean }) => (
    <View style={[styles.customConnector, isCompleted && styles.completedConnector]} />
  );

  const CustomButton = ({ label, onPress, disabled }: { label?: string; onPress: () => void; disabled: boolean }) => (
    <View
      style={[
        styles.customButton,
        disabled && styles.disabledButton
      ]}
      onTouchEnd={disabled ? undefined : onPress}
    >
      <Text style={styles.buttonContent}>
        {label}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StepperNavigation
        store={store}
        renderStep={CustomStep}
        renderConnector={CustomConnector}
        renderNextButton={CustomButton}
        renderBackButton={CustomButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F5F5F5'
  },
  customStep: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedStep: {
    backgroundColor: '#4CAF50',
  },
  currentStep: {
    backgroundColor: '#2196F3',
  },
  stepContent: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  customConnector: {
    width: 60,
    height: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  completedConnector: {
    backgroundColor: '#4CAF50',
  },
  customButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#2196F3',
    minWidth: 120,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
  },
  buttonContent: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
}); 