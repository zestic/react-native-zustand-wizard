import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { StepperNavigation } from './StepperNavigation';
import { WizardStore } from '../../stores/WizardStore';
import { StepConfig } from '../../types/index';

const meta = {
  title: 'Navigation/StepperNavigation',
  component: StepperNavigation,
};

export default meta;

const createStore = (currentStepId = 'step1', steps = [
  { id: 'step1', title: 'Step 1', component: () => null, order: 1 },
  { id: 'step2', title: 'Step 2', component: () => null, order: 2 },
  { id: 'step3', title: 'Step 3', component: () => null, order: 3 }
]) => {
  return WizardStore.create({
    currentStepId,
    steps,
    stepData: {}
  });
};

export const Default = () => {
  const store = createStore('step1');
  return (
    <View style={styles.container}>
      <StepperNavigation
        store={store}
        onNext={() => {}}
        onBack={() => {}}
      />
    </View>
  );
};

export const MiddleStep = () => {
  const store = createStore('step2');
  return (
    <View style={styles.container}>
      <StepperNavigation
        store={store}
        onNext={() => {}}
        onBack={() => {}}
      />
    </View>
  );
};

export const LastStep = () => {
  const store = createStore('step3');
  return (
    <View style={styles.container}>
      <StepperNavigation
        store={store}
        onNext={() => {}}
        onBack={() => {}}
      />
    </View>
  );
};

export const WithCompletedSteps = () => {
  const store = createStore('step3', [
    { id: 'step1', title: 'Step 1', component: () => null, order: 1 },
    { id: 'step2', title: 'Step 2', component: () => null, order: 2 },
    { id: 'step3', title: 'Step 3', component: () => null, order: 3 },
    { id: 'step4', title: 'Step 4', component: () => null, order: 4 }
  ]);
  return (
    <View style={styles.container}>
      <StepperNavigation
        store={store}
        onNext={() => {}}
        onBack={() => {}}
      />
    </View>
  );
};

export const WithCustomStepIndicator = () => {
  const store = createStore('step2');
  const CustomStep = ({ index, isCompleted, isCurrent }: { index: number; isCompleted: boolean; isCurrent: boolean }) => (
    <View style={[styles.customStep, isCompleted && styles.completedStep, isCurrent && styles.currentStep]}>
      <Text style={styles.stepText}>{index + 1}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StepperNavigation
        store={store}
        onNext={() => {}}
        onBack={() => {}}
        renderStep={({ index, isCompleted, isCurrent }) => (
          <CustomStep index={index} isCompleted={isCompleted} isCurrent={isCurrent} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  customStep: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedStep: {
    backgroundColor: '#4caf50',
  },
  currentStep: {
    backgroundColor: '#2196f3',
  },
  stepText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
}); 
