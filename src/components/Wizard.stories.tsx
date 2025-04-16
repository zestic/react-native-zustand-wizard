import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Wizard } from './Wizard';
import { WizardStore } from '../stores/WizardStore';
import { useStepContext } from '../utils/wizardUtils';
import { observer } from 'mobx-react-lite';
import { Instance } from 'mobx-state-tree';
import { Step } from '../types';

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 12,
    textAlign: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  customNavigation: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  customNavigationButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    minWidth: 120,
    padding: 12,
  },
  customNavigationText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderColor: '#E0E0E0',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    padding: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    color: '#666666',
    fontSize: 16,
    marginTop: 16,
  },
  step: {
    flex: 1,
    padding: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  wrapper: {
    backgroundColor: '#F5F5F5',
    flex: 1,
  },
});

// Base step components
const Step1Component = observer(
  ({ store }: { store: Instance<typeof WizardStore> }) => {
    console.log('Rendering Step1Component');
    const { updateField, getStepData, canMoveNext } = useStepContext('step1');
    const data = getStepData();

    // Enable/disable next button based on name field
    React.useEffect(() => {
      const name = data?.name || '';
      // Enable next button if name is not empty
      canMoveNext(name.trim() !== '');
    }, [data?.name]);

    return (
      <View style={styles.step}>
        <Text style={styles.title}>Step 1: Name</Text>
        <TextInput
          style={styles.input}
          value={data?.name || ''}
          onChangeText={(text) => updateField('name', text)}
          placeholder="Enter your name"
        />
      </View>
    );
  }
);

const Step2Component: React.FC<{ store: Instance<typeof WizardStore> }> =
  observer(({ store }) => {
    console.log('Rendering Step2Component');
    // Use the step context hook to get the step ID and helper functions
    const { updateField, getStepData, canMoveNext } = useStepContext('step2');

    // Get the current step data from the store
    const data = getStepData();

    // Enable/disable next button based on name field
    React.useEffect(() => {
      const email = data?.email || '';
      canMoveNext(email.trim() !== '');
    }, [data?.email]);

    return (
      <View style={styles.step}>
        <Text style={styles.title}>Step 2: Email</Text>
        <TextInput
          style={styles.input}
          value={data.email || ''}
          onChangeText={(value) => updateField('email', value)}
          placeholder="Enter your email"
        />
      </View>
    );
  });

const Step3Component: React.FC<{ store: Instance<typeof WizardStore> }> =
  observer(({ store }) => {
    console.log('Rendering Step3Component');
    // Use the step context hook to get the step ID and helper functions
    const { updateField, getStepData } = useStepContext('step3');

    // Get the current step data from the store
    const stepData = getStepData();

    return (
      <View style={styles.step}>
        <Text style={styles.title}>Step 3: Subscription</Text>
        <TextInput
          style={styles.input}
          value={stepData.subscription || ''}
          onChangeText={(value) => updateField('subscription', value)}
          placeholder="Enter your subscription"
        />
      </View>
    );
  });

console.log('Loading story file');

export default {
  title: 'Components/Wizard',
  component: Wizard,
  parameters: {
    notes: 'A wizard component for multi-step forms',
  },
};

// Default story with standard navigation
console.log('Defining Default story');

export const Default = () => {
  console.log('Starting Default story render');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    console.log('Default story mounted');
    setMounted(true);
  }, []);

  const steps: Step[] = [
    { id: 'step1', component: Step1Component, order: 1 },
    { id: 'step2', component: Step2Component, order: 2, nextLabel: 'Onwards' },
    {
      id: 'step3',
      component: Step3Component,
      order: 3,
      previousLabel: 'Backwards',
      canMoveNext: true,
    },
  ];

  console.log(
    'About to render Wizard with steps:',
    JSON.stringify(steps, null, 2)
  );

  return (
    <View style={styles.wrapper}>
      <Wizard steps={steps} />
    </View>
  );
};
