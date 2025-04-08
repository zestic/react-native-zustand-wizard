import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { StepperNavigation } from './StepperNavigation';
import { WizardStore } from '../../stores/WizardStore';
import { StepConfig } from '../../types';

describe('StepperNavigation', () => {
  const mockOnNext = jest.fn();
  const mockOnBack = jest.fn();

  const createStore = (steps: StepConfig[] = [
    { id: 'step1', title: 'Step 1', component: () => null },
    { id: 'step2', title: 'Step 2', hidden: true, component: () => null },
    { id: 'step3', title: 'Step 3', component: () => null }
  ]) => {
    return WizardStore.create({
      currentStepId: 'step1',
      completedSteps: [],
      steps,
      stepData: {}
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correct number of visible steps', () => {
    const store = createStore();
    const { getAllByTestId } = render(
      <StepperNavigation
        store={store}
        onNext={mockOnNext}
        onBack={mockOnBack}
      />
    );

    const steps = getAllByTestId('step');
    expect(steps).toHaveLength(2); // Only visible steps
  });

  it('renders correct number of connectors', () => {
    const store = createStore();
    const { getAllByTestId } = render(
      <StepperNavigation
        store={store}
        onNext={mockOnNext}
        onBack={mockOnBack}
      />
    );

    const connectors = getAllByTestId('connector');
    expect(connectors).toHaveLength(1); // Between 2 visible steps
  });

  it('handles next button click', () => {
    const store = createStore();
    const { getByTestId } = render(
      <StepperNavigation
        store={store}
        onNext={mockOnNext}
        onBack={mockOnBack}
      />
    );

    const nextButton = getByTestId('next-button');
    fireEvent.press(nextButton);

    expect(mockOnNext).toHaveBeenCalled();
  });

  it('handles back button click', () => {
    const store = createStore();
    const { getByTestId } = render(
      <StepperNavigation
        store={store}
        onNext={mockOnNext}
        onBack={mockOnBack}
      />
    );

    const backButton = getByTestId('back-button');
    fireEvent.press(backButton);

    expect(mockOnBack).toHaveBeenCalled();
  });

  it('disables back button on first step', () => {
    const store = createStore();
    const { getByTestId } = render(
      <StepperNavigation
        store={store}
        onNext={mockOnNext}
        onBack={mockOnBack}
      />
    );

    const backButton = getByTestId('back-button');
    expect(backButton.props.disabled).toBe(true);
  });

  it('disables next button when canMoveNext is false', () => {
    const store = createStore([
      { id: 'step1', title: 'Step 1', previous: undefined, component: () => null },
      { id: 'step2', title: 'Step 2', component: () => null }
    ]);
    const { getByTestId } = render(
      <StepperNavigation
        store={store}
        onNext={mockOnNext}
        onBack={mockOnBack}
      />
    );

    const nextButton = getByTestId('next-button');
    expect(nextButton.props.disabled).toBe(true);
  });

  it('renders custom step indicator', () => {
    const store = createStore();
    const CustomStep = ({ index }: { index: number }) => (
      <View testID="custom-step">{`Custom ${index + 1}`}</View>
    );

    const { getAllByTestId } = render(
      <StepperNavigation
        store={store}
        onNext={mockOnNext}
        onBack={mockOnBack}
        renderStep={({ index }) => <CustomStep index={index} />}
      />
    );

    const customSteps = getAllByTestId('custom-step');
    expect(customSteps).toHaveLength(2);
    expect(customSteps[0].props.children).toBe('Custom 1');
    expect(customSteps[1].props.children).toBe('Custom 2');
  });

  it('renders custom navigation buttons', () => {
    const store = createStore();
    const CustomButton = ({ label, onPress }: { label: string; onPress: () => void }) => (
      <TouchableOpacity testID={`custom-${label.toLowerCase()}`} onPress={onPress}>
        <View>{`Custom ${label}`}</View>
      </TouchableOpacity>
    );

    const { getByTestId } = render(
      <StepperNavigation
        store={store}
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