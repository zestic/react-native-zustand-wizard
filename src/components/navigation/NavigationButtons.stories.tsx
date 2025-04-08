import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { NavigationButtons } from './NavigationButtons';
import { WizardStore } from '../../stores/WizardStore';

const meta = {
  title: 'Navigation/NavigationButtons',
  component: NavigationButtons,
};

export default meta;

const createStore = (canMoveNext = true, canMoveBack = true, currentStepId = 'step1') => {
  return WizardStore.create({
    currentStepId,
    completedSteps: [],
    steps: [
      { id: 'step1', title: 'Step 1', component: () => null },
      { 
        id: 'step2', 
        title: 'Step 2', 
        component: () => null, 
        ...(canMoveBack ? { previous: () => 'step1' } : {}),
        ...(canMoveNext ? {} : { validate: () => false })
      }
    ],
    stepData: {}
  });
};

export const Default = () => {
  const store = createStore(true, true, 'step2');
  return (
    <View style={styles.container}>
      <NavigationButtons 
        store={store} 
        onNext={() => {}} 
        onBack={() => {}}
      />
    </View>
  );
};

export const DisabledNext = () => {
  const store = createStore(false, true, 'step2');
  return (
    <View style={styles.container}>
      <NavigationButtons 
        store={store} 
        onNext={() => {}} 
        onBack={() => {}}
      />
    </View>
  );
};

export const DisabledBack = () => {
  const store = createStore(true, false, 'step2');
  return (
    <View style={styles.container}>
      <NavigationButtons 
        store={store} 
        onNext={() => {}} 
        onBack={() => {}}
      />
    </View>
  );
};

export const WithCustomButtons = () => {
  const store = createStore(true, true, 'step2');
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
      <NavigationButtons
        store={store}
        onNext={() => {}}
        onBack={() => {}}
        renderNextButton={CustomButton}
        renderBackButton={CustomButton}
      />
    </View>
  );
};

export const HiddenBack = () => {
  const store = createStore(true, true, 'step1');
  return (
    <View style={styles.container}>
      <NavigationButtons 
        store={store} 
        onNext={() => {}} 
        onBack={() => {}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F5F5F5'
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