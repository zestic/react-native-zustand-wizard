import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { types, Instance } from 'mobx-state-tree';
import { Wizard } from './Wizard';
import { WizardStore } from '../stores/WizardStore';
import { Text, View } from 'react-native';

// Mock step components
const EmailStep = ({ store }) => (
  <View testID="email-step">
    <Text>Email Step</Text>
    <Text testID="email-input" onPress={() => {
      store.setStepData('email', { email: 'test@example.com' });
    }}>
      Set Email
    </Text>
  </View>
);

const SubscriptionStep = ({ store }) => (
  <View testID="subscription-step">
    <Text>Subscription Step</Text>
    <Text testID="plan-select" onPress={() => {
      store.setStepData('subscription', { planId: 'basic' });
    }}>
      Select Plan
    </Text>
  </View>
);

describe('Wizard Component', () => {
  let store: Instance<typeof WizardStore>;

  const steps = [
    {
      id: 'email',
      title: 'Email',
      component: EmailStep,
      validate: (data: any) => !!data?.email,
      next: () => 'subscription',
    },
    {
      id: 'subscription',
      title: 'Subscription',
      component: SubscriptionStep,
      validate: (data: any) => !!data?.planId,
      previous: () => 'email',
    },
  ];

  beforeEach(() => {
    store = WizardStore.create({
      currentStepId: 'email',
      steps,
      stepData: {},
      isLoading: false,
      error: undefined
    });
  });

  it('renders the initial step correctly', () => {
    const { getByTestId } = render(
      <Wizard
        store={store}
        steps={steps}
      />
    );

    expect(getByTestId('email-step')).toBeTruthy();
  });

  it('navigates to next step when current step is completed', async () => {
    const { getByTestId } = render(
      <Wizard
        store={store}
        steps={steps}
      />
    );

    // Complete email step
    fireEvent.press(getByTestId('email-input'));

    // Wait for navigation to subscription step
    await waitFor(() => {
      expect(getByTestId('subscription-step')).toBeTruthy();
    });
  });

  it('maintains step data in store', async () => {
    const { getByTestId } = render(
      <Wizard
        store={store}
        steps={steps}
      />
    );

    // Complete email step
    fireEvent.press(getByTestId('email-input'));

    expect(store.stepData.get('email')).toEqual({ email: 'test@example.com' });
  });

  it('handles step validation', () => {
    const { getByTestId } = render(
      <Wizard
        store={store}
        steps={steps}
      />
    );

    expect(store.getCanMoveNext()).toBeFalsy();
    
    // Set valid email data
    fireEvent.press(getByTestId('email-input'));
    
    expect(store.getCanMoveNext()).toBeTruthy();
  });
});
