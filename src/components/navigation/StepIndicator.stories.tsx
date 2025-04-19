import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StepIndicator } from './StepIndicator';
import { WizardStore } from '../../stores/WizardStore';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  storyContainer: {
    marginBottom: 10,
  },
});

export default {
  title: 'Components/StepIndicator',
  component: StepIndicator,
};

const createStore = (currentStepPosition = 1) => {
  const steps = [
    { id: 'step1', order: 1, canMoveNext: true },
    { id: 'step2', order: 2, canMoveNext: true },
    { id: 'step3', order: 3, canMoveNext: true },
  ];
  return WizardStore.create({
    currentStepId: `step${currentStepPosition}`,
    currentStepPosition,
    steps,
    stepData: {},
  });
};

export const Default = () => {
  createStore(1);
  return (
    <View style={styles.container}>
      <View style={styles.storyContainer}>
        <StepIndicator />
      </View>
    </View>
  );
};

export const MiddleStep = () => {
  createStore(2);
  return (
    <View style={styles.container}>
      <View style={styles.storyContainer}>
        <StepIndicator />
      </View>
    </View>
  );
};

export const LastStep = () => {
  createStore(3);
  return (
    <View style={styles.container}>
      <View style={styles.storyContainer}>
        <StepIndicator />
      </View>
    </View>
  );
};
