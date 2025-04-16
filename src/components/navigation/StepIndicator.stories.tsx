import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { StepIndicator } from './StepIndicator';
import { WizardStore } from '../../stores/WizardStore';

const meta = {
  title: 'Navigation/StepIndicator',
  component: StepIndicator,
};

export default meta;

const createStore = (currentStepPosition = 1, steps = [
  { id: 'step1', order: 1, canMoveNext: true },
  { id: 'step2', order: 2, canMoveNext: true },
  { id: 'step3', order: 3, canMoveNext: true }
]) => {
  const currentStep = steps.find(step => step.order === currentStepPosition);
  return WizardStore.create({
    currentStepId: currentStep ? currentStep.id : steps[0].id,
    currentStepPosition,
    steps,
    stepData: {}
  });
};

export const Default = () => {
  const store = createStore(1);
  return (
    <View style={styles.container}>
      <StepIndicator/>
    </View>
  );
};

export const MiddleStep = () => {
  const store = createStore(2);
  return (
    <View style={styles.container}>
      <StepIndicator />
    </View>
  );
};

export const LastStep = () => {
  const store = createStore(3);
  return (
    <View style={styles.container}>
      <StepIndicator/>
    </View>
  );
};

export const WithCustomStyle = () => {
  const store = createStore(2);
  return (
    <View style={styles.container}>
      <Text style={styles.description}>StepIndicator with custom style</Text>
      <StepIndicator style={{ backgroundColor: '#EEE', borderRadius: 8, padding: 8 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F5F5F5'
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    textAlign: 'center'
  }
}); 