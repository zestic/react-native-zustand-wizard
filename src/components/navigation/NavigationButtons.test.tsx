import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationButtons } from './NavigationButtons';
import { WizardStore } from '../../stores/WizardStore';
import { StepConfig } from '../../types/index';
import { TouchableOpacity, Text } from 'react-native';
import { types } from 'mobx-state-tree';

// Mock the WizardStore
jest.mock('../../stores/WizardStore', () => ({
  WizardStore: {
    create: jest.fn(),
  },
}));

describe('NavigationButtons', () => {
  // Helper function to create a mock store
  const createMockStore = (currentStepId = 'step1', currentStepPosition = 1) => {
    const mockStepData = types.map(types.frozen()).create({});
    const mockSteps = types.array(types.frozen()).create([
      { id: 'step1', title: 'Step 1', component: () => null, order: 1 },
      { id: 'step2', title: 'Step 2', component: () => null, order: 2 },
      { id: 'step3', title: 'Step 3', component: () => null, order: 3 }
    ]);

    return {
      currentStepId,
      currentStepPosition,
      steps: mockSteps,
      getCanMoveNext: jest.fn().mockReturnValue(true),
      getCanMoveBack: jest.fn().mockReturnValue(true),
      isLoading: false,
      error: undefined,
      stepData: mockStepData
    };
  };

  it('renders both back and next buttons by default', () => {
    const mockStore = createMockStore('step2', 2);
    const onNext = jest.fn();
    const onBack = jest.fn();

    const { getByText } = render(
      <NavigationButtons
        store={mockStore as any}
        onNext={onNext}
        onBack={onBack}
      />
    );

    expect(getByText('Back')).toBeTruthy();
    expect(getByText('Next')).toBeTruthy();
  });

  it('hides back button on first step', () => {
    const mockStore = createMockStore('step1', 1);
    const onNext = jest.fn();
    const onBack = jest.fn();

    const { queryByText, getByText } = render(
      <NavigationButtons
        store={mockStore as any}
        onNext={onNext}
        onBack={onBack}
      />
    );

    expect(queryByText('Back')).toBeNull();
    expect(getByText('Next')).toBeTruthy();
  });

  it('calls onNext when next button is pressed', () => {
    const mockStore = createMockStore('step1', 1);
    const onNext = jest.fn();
    const onBack = jest.fn();

    const { getByText } = render(
      <NavigationButtons
        store={mockStore as any}
        onNext={onNext}
        onBack={onBack}
      />
    );

    fireEvent.press(getByText('Next'));
    expect(onNext).toHaveBeenCalled();
  });

  it('calls onBack when back button is pressed', () => {
    const mockStore = createMockStore('step2', 2);
    const onNext = jest.fn();
    const onBack = jest.fn();

    const { getByText } = render(
      <NavigationButtons
        store={mockStore as any}
        onNext={onNext}
        onBack={onBack}
      />
    );

    fireEvent.press(getByText('Back'));
    expect(onBack).toHaveBeenCalled();
  });

  it('disables next button when canMoveNext is false', () => {
    const mockStore = {
      ...createMockStore('step1', 1),
      getCanMoveNext: jest.fn().mockReturnValue(false),
    };
    const onNext = jest.fn();
    const onBack = jest.fn();

    const { getByText } = render(
      <NavigationButtons
        store={mockStore as any}
        onNext={onNext}
        onBack={onBack}
      />
    );

    const nextButton = getByText('Next').parent;
    expect(nextButton.props.accessibilityState.disabled).toBe(true);
  });

  it('disables back button when canMoveBack is false', () => {
    const mockStore = {
      ...createMockStore('step2', 2),
      getCanMoveBack: jest.fn().mockReturnValue(false),
    };
    const onNext = jest.fn();
    const onBack = jest.fn();

    const { getByText } = render(
      <NavigationButtons
        store={mockStore as any}
        onNext={onNext}
        onBack={onBack}
      />
    );

    const backButton = getByText('Back').parent;
    expect(backButton.props.accessibilityState.disabled).toBe(true);
  });

  it('renders custom next button when provided', () => {
    const mockStore = createMockStore('step1', 1);
    const onNext = jest.fn();
    const onBack = jest.fn();
    const CustomButton = ({ label, onPress, disabled }: { label?: string; onPress: () => void; disabled: boolean }) => (
      <TouchableOpacity
        testID={`custom-${label?.toLowerCase()}`}
        onPress={onPress}
        disabled={disabled}
      >
        <Text>Custom {label}</Text>
      </TouchableOpacity>
    );

    const { getByTestId } = render(
      <NavigationButtons
        store={mockStore as any}
        onNext={onNext}
        onBack={onBack}
        renderNextButton={CustomButton}
      />
    );

    expect(getByTestId('custom-next')).toBeTruthy();
  });

  it('renders custom back button when provided', () => {
    const mockStore = createMockStore('step2', 2);
    const onNext = jest.fn();
    const onBack = jest.fn();
    const CustomButton = ({ label, onPress, disabled }: { label?: string; onPress: () => void; disabled: boolean }) => (
      <TouchableOpacity
        testID={`custom-${label?.toLowerCase()}`}
        onPress={onPress}
        disabled={disabled}
      >
        <Text>Custom {label}</Text>
      </TouchableOpacity>
    );

    const { getByTestId } = render(
      <NavigationButtons
        store={mockStore as any}
        onNext={onNext}
        onBack={onBack}
        renderBackButton={CustomButton}
      />
    );

    expect(getByTestId('custom-back')).toBeTruthy();
  });

  it('applies disabled styles when button is disabled', () => {
    const mockStore = {
      ...createMockStore('step1', 1),
      getCanMoveNext: jest.fn().mockReturnValue(false),
    };
    const onNext = jest.fn();
    const onBack = jest.fn();

    const { getByText } = render(
      <NavigationButtons
        store={mockStore as any}
        onNext={onNext}
        onBack={onBack}
      />
    );

    const nextButton = getByText('Next').parent;
    expect(nextButton.props.style).toContainEqual(expect.objectContaining({
      backgroundColor: '#cccccc'
    }));
  });

  it('shows Finish button on last step', () => {
    const mockStore = createMockStore('step3', 3);
    const onNext = jest.fn();
    const onBack = jest.fn();

    const { getByText } = render(
      <NavigationButtons
        store={mockStore as any}
        onNext={onNext}
        onBack={onBack}
      />
    );

    expect(getByText('Finish')).toBeTruthy();
  });
}); 