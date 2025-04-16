import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Wizard } from './Wizard';
import { WizardStore } from '../stores/WizardStore';
import { useStepContext } from '../utils/wizardUtils';
import { observer } from 'mobx-react-lite';
import { Instance } from 'mobx-state-tree';
import { Step } from '../types';
import { colors } from '../theme/colors';

const styles = StyleSheet.create({
  input: {
    borderColor: colors.gray300,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    padding: 12,
  },
  step: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  wrapper: {
    backgroundColor: colors.gray100,
    flex: 1,
  },
});

interface StepData {
  name?: string;
  email?: string;
  subscription?: string;
}

// Base step components
const Step1Component = observer(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ store }: { store: Instance<typeof WizardStore> }) => {
    const { updateField, getStepData, canMoveNext } = useStepContext('step1');
    const data = getStepData() as StepData;

    React.useEffect(() => {
      const name = data?.name || '';
      canMoveNext(name.trim() !== '');
    }, [data?.name, canMoveNext]);

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
  observer(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ store }) => {
      const { updateField, getStepData, canMoveNext } = useStepContext('step2');
      const data = getStepData() as StepData;

      React.useEffect(() => {
        const email = data?.email || '';
        canMoveNext(email.trim() !== '');
      }, [data?.email, canMoveNext]);

      return (
        <View style={styles.step}>
          <Text style={styles.title}>Step 2: Email</Text>
          <TextInput
            style={styles.input}
            value={data?.email || ''}
            onChangeText={(value) => updateField('email', value)}
            placeholder="Enter your email"
          />
        </View>
      );
    }
  );

const Step3Component: React.FC<{ store: Instance<typeof WizardStore> }> =
  observer(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ store }) => {
      const { updateField, getStepData } = useStepContext('step3');
      const stepData = getStepData() as StepData;

      return (
        <View style={styles.step}>
          <Text style={styles.title}>Step 3: Subscription</Text>
          <TextInput
            style={styles.input}
            value={stepData?.subscription || ''}
            onChangeText={(value) => updateField('subscription', value)}
            placeholder="Enter your subscription"
          />
        </View>
      );
    }
  );

export default {
  title: 'Components/Wizard',
  component: Wizard,
  parameters: {
    notes: 'A wizard component for multi-step forms',
  },
};

export const Default = () => {
  const steps: Step[] = [
    {
      id: 'step1',
      component: Step1Component as React.ComponentType<Record<string, unknown>>,
      order: 1,
    },
    {
      id: 'step2',
      component: Step2Component as React.ComponentType<Record<string, unknown>>,
      order: 2,
      nextLabel: 'Onwards',
    },
    {
      id: 'step3',
      component: Step3Component as React.ComponentType<Record<string, unknown>>,
      order: 3,
      previousLabel: 'Backwards',
      canMoveNext: true,
    },
  ];

  return (
    <View style={styles.wrapper}>
      <Wizard steps={steps} />
    </View>
  );
};
