import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { StepperNavigation } from './StepperNavigation';
import { WizardStore } from '../../stores/WizardStore';
import { StepConfig } from '../../types/index';
import { types } from 'mobx-state-tree';

describe('StepperNavigation', () => {
  const mockOnNext = jest.fn();
  const mockOnBack = jest.fn();

  const createStore = (steps: StepConfig[] = [
    { id: 'step1', title: 'Step 1', component: () => null, order: 1 },
    { id: 'step2', title: 'Step 2', component: () => null, order: 2 },
    { id: 'step3', title: 'Step 3', component: () => null, order: 3 }
  ]) => {
    const mockStepData = types.map(types.frozen()).create({});
    const mockSteps = types.array(types.frozen()).create(steps);

    return {
      currentStepId: 'step1',
      currentStepPosition: 1,
      steps: mockSteps,
      stepData: mockStepData,
      getCanMoveNext: jest.fn().mockReturnValue(true),
      getCanMoveBack: jest.fn().mockReturnValue(true),
      isLoading: false,
      error: undefined
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correct number of visible steps', () => {
    const store = createStore([
      { id: 'step1', title: 'Step 1', component: () => null, order: 1 },
      { id: 'step2', title: 'Step 2', component: () => null, order: 2 }
    ]);
    const { getAllByTestId } = render(
      <StepperNavigation
        store={store as any}
        onNext={mockOnNext}
        onBack={mockOnBack}
      />
    );

    const steps = getAllByTestId('step');
    expect(steps).toHaveLength(2);
  });

  it('renders correct number of connectors', () => {
    const store = createStore([
      { id: 'step1', title: 'Step 1', component: () => null, order: 1 },
      { id: 'step2', title: 'Step 2', component: () => null, order: 2 }
    ]);
    const { getAllByTestId } = render(
      <StepperNavigation
        store={store as any}
        onNext={mockOnNext}
        onBack={mockOnBack}
      />
    );

    const connectors = getAllByTestId('connector');
    expect(connectors).toHaveLength(1);
  });

  it('handles next button click', () => {
    const store = createStore();
    const { getByText } = render(
      <StepperNavigation
        store={store as any}
        onNext={mockOnNext}
        onBack={mockOnBack}
      />
    );

    fireEvent.press(getByText('Next'));
    expect(mockOnNext).toHaveBeenCalled();
  });

  it('handles back button click', () => {
    const store = createStore();
    store.currentStepId = 'step2';
    store.currentStepPosition = 2;
    const { getByText } = render(
      <StepperNavigation
        store={store as any}
        onNext={mockOnNext}
        onBack={mockOnBack}
      />
    );

    fireEvent.press(getByText('Back'));
    expect(mockOnBack).toHaveBeenCalled();
  });

  it('disables back button on first step', () => {
    const store = createStore();
    store.getCanMoveBack.mockReturnValue(false);
    const { getByText } = render(
      <StepperNavigation
        store={store as any}
        onNext={mockOnNext}
        onBack={mockOnBack}
      />
    );

    const backButton = getByText('Back').parent;
    expect(backButton.props.accessibilityState.disabled).toBe(true);
  });

  it('disables next button when canMoveNext is false', () => {
    const store = createStore();
    store.getCanMoveNext.mockReturnValue(false);
    const { getByText } = render(
      <StepperNavigation
        store={store as any}
        onNext={mockOnNext}
        onBack={mockOnBack}
      />
    );

    const nextButton = getByText('Next').parent;
    expect(nextButton.props.accessibilityState.disabled).toBe(true);
  });

  it('renders custom step indicator', () => {
    const store = createStore([
      { id: 'step1', title: 'Step 1', component: () => null, order: 1 },
      { id: 'step2', title: 'Step 2', component: () => null, order: 2 }
    ]);
    const CustomStep = ({ index }: { index: number }) => (
      <View testID="custom-step">
        <Text>{`Custom ${index + 1}`}</Text>
      </View>
    );

    const { getAllByTestId } = render(
      <StepperNavigation
        store={store as any}
        onNext={mockOnNext}
        onBack={mockOnBack}
        renderStep={({ index }) => <CustomStep index={index} />}
      />
    );

    const customSteps = getAllByTestId('custom-step');
    expect(customSteps).toHaveLength(2);
  });

  it('renders custom navigation buttons', () => {
    const store = createStore();
    store.currentStepId = 'step2';
    store.currentStepPosition = 2;
    const CustomButton = ({ label, onPress }: { label: string; onPress: () => void }) => (
      <TouchableOpacity testID={`custom-${label.toLowerCase()}`} onPress={onPress}>
        <View>{`Custom ${label}`}</View>
      </TouchableOpacity>
    );

    const { getByTestId } = render(
      <StepperNavigation
        store={store as any}
        onNext={mockOnNext}
        onBack={mockOnBack}
        renderNextButton={({ onPress }) => <CustomButton label="Next" onPress={onPress} />}
        renderBackButton={({ onPress }) => <CustomButton label="Back" onPress={onPress} />}
      />
    );

    expect(getByTestId('custom-next')).toBeTruthy();
    expect(getByTestId('custom-back')).toBeTruthy();
  });
}); 