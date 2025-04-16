import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Wizard } from './Wizard';
import { Text, View } from 'react-native';
import { Step } from '../types';
import { WizardStore } from '../stores/WizardStore';
import { useNavigationContext } from '../utils/wizardUtils';

jest.mock('../utils/wizardUtils', () => {
  const actual = jest.requireActual('../utils/wizardUtils');
  return {
    ...actual,
    useNavigationContext: jest.fn(),
  };
});

const mockNav = useNavigationContext as jest.Mock;

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

// Mock WizardStore
jest.mock('../stores/WizardStore', () => {
  const actual = jest.requireActual('../stores/WizardStore');
  return {
    WizardStore: {
      create: jest.fn().mockImplementation((snapshot) => {
        const steps = snapshot.steps.map(step => ({
          id: step.id,
          order: step.order,
          canMoveNext: step.canMoveNext,
          nextLabel: step.nextLabel,
          previousLabel: step.previousLabel
        }));

        return {
          currentStepId: steps[0].id,
          currentStepPosition: steps[0].order,
          steps,
          stepData: new Map(),
          isLoading: false,
          error: '',
          moveNext: jest.fn(),
          moveBack: jest.fn(),
          setStepData: jest.fn(),
          getStepData: jest.fn(),
          getWizardData: jest.fn(),
          setLoading: jest.fn(),
          setError: jest.fn(),
          reset: jest.fn()
        };
      })
    }
  };
});

describe('Wizard Component', () => {
  const steps: Step[] = [
    {
      id: 'email',
      component: EmailStep,
      order: 1,
      canMoveNext: false
    },
    {
      id: 'subscription',
      component: SubscriptionStep,
      order: 2,
      canMoveNext: true
    }
  ];

  describe('converts Step[] to StepModel[]', () => {
    it('with standard labels', () => {
      mockNav.mockReturnValue({
        isPreviousHidden: true,
        isNextDisabled: true,
        nextLabel: 'Next',
        previousLabel: 'Back',
        currentStepPosition: 1,
        totalSteps: 2,
        onNext: jest.fn(),
        onPrevious: jest.fn(),
      });
      render(
        <Wizard
          steps={steps}
        />
      );

      const expectedSteps = [
        {
          id: 'email',
          order: 1,
          canMoveNext: false,
          nextLabel: 'Next',
          previousLabel: 'Back'
        },
        {
          id: 'subscription',
          order: 2,
          canMoveNext: true,
          nextLabel: 'Finish',
          previousLabel: 'Back'
        }
      ];

      // check the steps that are passed into the mock WizardStore
      expect(WizardStore.create).toHaveBeenCalledWith({
        steps: expectedSteps
      });
    });

    it('with Wizard override labels', () => {
      mockNav.mockReturnValue({
        isPreviousHidden: true,
        isNextDisabled: true,
        nextLabel: 'Proceed',
        previousLabel: 'Regress',
        currentStepPosition: 1,
        totalSteps: 2,
        onNext: jest.fn(),
        onPrevious: jest.fn(),
      });
      render(
        <Wizard
          steps={steps}
          nextLabel='Proceed'
          previousLabel='Regress'
          finishLabel='Done'
        />
      );

      const expectedSteps = [
        {
          id: 'email',
          order: 1,
          canMoveNext: false,
          nextLabel: 'Proceed',
          previousLabel: 'Regress'
        },
        {
          id: 'subscription',
          order: 2,
          canMoveNext: true,
          nextLabel: 'Done',
          previousLabel: 'Regress'
        }
      ];

      // check the steps that are passed into the mock WizardStore
      expect(WizardStore.create).toHaveBeenCalledWith({
        steps: expectedSteps
      });
    });

    it('with Step override labels', () => {
      mockNav.mockReturnValue({
        isPreviousHidden: true,
        isNextDisabled: true,
        nextLabel: 'Run Forrest Run',
        previousLabel: 'Regress',
        currentStepPosition: 1,
        totalSteps: 2,
        onNext: jest.fn(),
        onPrevious: jest.fn(),
      });
      const steps: Step[] = [
        {
          id: 'email',
          component: EmailStep,
          order: 1,
          nextLabel: 'Run Forrest Run',
        },
        {
          id: 'subscription',
          component: SubscriptionStep,
          order: 2,
          nextLabel: 'Stop Forrest Stop',
          previousLabel: 'Go Back',
        }
      ];
      render(
        <Wizard
          steps={steps}
          nextLabel='Proceed'
          previousLabel='Regress'
          finishLabel='Done'
        />
      );

      const expectedSteps = [
        {
          id: 'email',
          order: 1,
          canMoveNext: false,
          nextLabel: 'Run Forrest Run',
          previousLabel: 'Regress'
        },
        {
          id: 'subscription',
          order: 2,
          canMoveNext: false,
          nextLabel: 'Stop Forrest Stop',
          previousLabel: 'Go Back'
        }
      ];

      // check the steps that are passed into the mock WizardStore
      expect(WizardStore.create).toHaveBeenCalledWith({
        steps: expectedSteps
      });
    });
  });

  it('renders the correct component based on currentStepId', () => {
    mockNav.mockReturnValue({
      isPreviousHidden: true,
      isNextDisabled: true,
      nextLabel: 'Next',
      previousLabel: 'Back',
      currentStepPosition: 1,
      totalSteps: 2,
      onNext: jest.fn(),
      onPrevious: jest.fn(),
    });
    const { getByTestId } = render(
      <Wizard
        steps={steps}
      />
    );
    expect(getByTestId('email-step')).toBeTruthy();
    expect(() => getByTestId('subscription-step')).toThrow();
  });

  it('handles step data updates', async () => {
    mockNav.mockReturnValue({
      isPreviousHidden: true,
      isNextDisabled: true,
      nextLabel: 'Next',
      previousLabel: 'Back',
      currentStepPosition: 1,
      totalSteps: 2,
      onNext: jest.fn(),
      onPrevious: jest.fn(),
    });
    const { getByTestId } = render(
      <Wizard
        steps={steps}
      />
    );
    fireEvent.press(getByTestId('email-input'));
    await waitFor(() => {
      expect(getByTestId('email-step')).toBeTruthy();
    });
  });

  describe('loading state', () => {
    it('renders default loading UI when isLoading is true', () => {
      // Override the mock to return a loading state
      (WizardStore.create as jest.Mock).mockImplementationOnce(() => ({
        currentStepId: steps[0].id,
        currentStepPosition: steps[0].order,
        steps: [],
        stepData: new Map(),
        isLoading: true,
        error: '',
        moveNext: jest.fn(),
        moveBack: jest.fn(),
        setStepData: jest.fn(),
        getStepData: jest.fn(),
        getWizardData: jest.fn(),
        setLoading: jest.fn(),
        setError: jest.fn(),
        reset: jest.fn()
      }));

      const { getByText } = render(
        <Wizard
          steps={steps}
        />
      );

      expect(getByText('Loading...')).toBeTruthy();
    });

    it('renders custom loading UI when renderLoading prop is provided', () => {
      // Override the mock to return a loading state
      (WizardStore.create as jest.Mock).mockImplementationOnce(() => ({
        currentStepId: steps[0].id,
        currentStepPosition: steps[0].order,
        steps: [],
        stepData: new Map(),
        isLoading: true,
        error: '',
        moveNext: jest.fn(),
        moveBack: jest.fn(),
        setStepData: jest.fn(),
        getStepData: jest.fn(),
        getWizardData: jest.fn(),
        setLoading: jest.fn(),
        setError: jest.fn(),
        reset: jest.fn()
      }));

      const CustomLoading = () => <Text testID="custom-loading">Custom Loading...</Text>;

      const { getByTestId } = render(
        <Wizard
          steps={steps}
          renderLoading={CustomLoading}
        />
      );

      expect(getByTestId('custom-loading')).toBeTruthy();
    });
  });

  describe('error state', () => {
    it('renders default error UI when store has error', () => {
      // Override the mock to return an error state
      (WizardStore.create as jest.Mock).mockImplementationOnce(() => ({
        currentStepId: steps[0].id,
        currentStepPosition: steps[0].order,
        steps: [],
        stepData: new Map(),
        isLoading: false,
        error: 'Test error message',
        moveNext: jest.fn(),
        moveBack: jest.fn(),
        setStepData: jest.fn(),
        getStepData: jest.fn(),
        getWizardData: jest.fn(),
        setLoading: jest.fn(),
        setError: jest.fn(),
        reset: jest.fn()
      }));

      const { getByText } = render(
        <Wizard
          steps={steps}
        />
      );

      expect(getByText('Test error message')).toBeTruthy();
    });
  });
});
