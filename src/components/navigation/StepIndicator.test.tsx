import React from 'react';
import { render } from '@testing-library/react-native';
import { StepIndicator } from './StepIndicator';
import { WizardStore } from '../../stores/WizardStore';
import { View, Text } from 'react-native';
import { StepConfig } from '../../types/index';
import { WizardStoreType } from '../../types/store';

// Mock the WizardStore
jest.mock('../../stores/WizardStore', () => ({
  WizardStore: {
    create: jest.fn().mockImplementation((snapshot) => ({
      currentStepId: snapshot.currentStepId,
      steps: snapshot.steps,
      getCurrentStepIndex: jest.fn().mockReturnValue(snapshot.steps.findIndex(s => s.id === snapshot.currentStepId)),
      isLoading: false,
      error: undefined,
      stepData: new Map()
    }))
  },
}));

describe('StepIndicator', () => {
  const createMockStore = (currentStepIndex = 0): WizardStoreType => {
    const steps = [
      { id: 'step1', title: 'Step 1', component: () => null },
      { id: 'step2', title: 'Step 2', component: () => null },
      { id: 'step3', title: 'Step 3', component: () => null }
    ];
    return WizardStore.create({
      currentStepId: steps[currentStepIndex].id,
      steps
    }) as WizardStoreType;
  };

  it('renders all steps', () => {
    const mockStore = createMockStore();
    const { getAllByTestId } = render(<StepIndicator store={mockStore} />);
    const steps = getAllByTestId('step');
    expect(steps).toHaveLength(3);
  });

  it('renders connectors between steps', () => {
    const mockStore = createMockStore();
    const { getAllByTestId } = render(<StepIndicator store={mockStore} />);
    const connectors = getAllByTestId('connector');
    expect(connectors).toHaveLength(2);
  });

  it('marks steps before current step as completed', () => {
    const mockStore = createMockStore(1); // Current step is step2
    const { getAllByTestId } = render(<StepIndicator store={mockStore} />);
    const steps = getAllByTestId('step');
    expect(steps[0].props.style).toContainEqual(expect.objectContaining({
      backgroundColor: '#4CAF50' // Completed step color
    }));
  });

  it('marks current step as current', () => {
    const mockStore = createMockStore(1); // Current step is step2
    const { getAllByTestId } = render(<StepIndicator store={mockStore} />);
    const steps = getAllByTestId('step');
    expect(steps[1].props.style).toContainEqual(expect.objectContaining({
      backgroundColor: '#2196F3' // Current step color
    }));
  });

  it('marks steps after current step as not completed or current', () => {
    const mockStore = createMockStore(1); // Current step is step2
    const { getAllByTestId } = render(<StepIndicator store={mockStore} />);
    const steps = getAllByTestId('step');
    expect(steps[2].props.style).toContainEqual(expect.objectContaining({
      backgroundColor: '#E0E0E0' // Default step color
    }));
  });

  it('renders custom step component when provided', () => {
    const mockStore = createMockStore();
    const CustomStep = ({ index, isCompleted, isCurrent }) => (
      <View testID="custom-step">
        <Text>Custom Step {index + 1}</Text>
        <Text>{isCompleted ? 'Completed' : isCurrent ? 'Current' : 'Upcoming'}</Text>
      </View>
    );

    const { getAllByTestId } = render(
      <StepIndicator store={mockStore} renderStep={CustomStep} />
    );

    const customSteps = getAllByTestId('custom-step');
    expect(customSteps).toHaveLength(3);
  });

  it('renders custom connector component when provided', () => {
    const mockStore = createMockStore();
    const CustomConnector = ({ isCompleted }) => (
      <View testID="custom-connector">
        <Text>{isCompleted ? 'Completed' : 'Not Completed'}</Text>
      </View>
    );

    const { getAllByTestId } = render(
      <StepIndicator store={mockStore} renderConnector={CustomConnector} />
    );

    const customConnectors = getAllByTestId('custom-connector');
    expect(customConnectors).toHaveLength(2);
  });
}); 