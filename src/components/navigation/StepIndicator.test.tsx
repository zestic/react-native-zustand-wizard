import React from 'react';
import { render } from '@testing-library/react-native';
import { StepIndicator } from './StepIndicator';
import { WizardStore } from '../../stores/WizardStore';
import { View, Text } from 'react-native';
import { types } from 'mobx-state-tree';
import { StepConfig } from '../../types';

// Mock the WizardStore
jest.mock('../../stores/WizardStore', () => ({
  WizardStore: {
    create: jest.fn(),
  },
}));

describe('StepIndicator', () => {
  const createStore = (steps: StepConfig[] = [
    { id: 'step1', title: 'Step 1', component: () => null },
    { id: 'step2', title: 'Step 2', component: () => null },
    { id: 'step3', title: 'Step 3', component: () => null }
  ]) => {
    const store = WizardStore.create({
      currentStepId: 'step1',
      completedSteps: types.array(types.string).create([]),
      steps,
      stepData: {}
    });
    return store;
  };

  it('renders correct number of steps', () => {
    const store = createStore();
    const { getAllByTestId } = render(<StepIndicator store={store} />);
    const steps = getAllByTestId('step');
    expect(steps).toHaveLength(3);
  });

  it('renders correct number of connectors', () => {
    const store = createStore();
    const { getAllByTestId } = render(<StepIndicator store={store} />);
    const connectors = getAllByTestId('connector');
    expect(connectors).toHaveLength(2); // n-1 connectors for n steps
  });

  it('marks current step correctly', () => {
    const store = createStore();
    store.currentStepId = 'step2';
    const { getAllByTestId } = render(<StepIndicator store={store} />);
    const steps = getAllByTestId('step');
    expect(steps[1].props.style).toContainEqual(expect.objectContaining({ backgroundColor: '#2196F3' }));
  });

  it('marks completed steps correctly', () => {
    const store = createStore();
    store.completedSteps.push('step1');
    const { getAllByTestId } = render(<StepIndicator store={store} />);
    const steps = getAllByTestId('step');
    expect(steps[0].props.style).toContainEqual(expect.objectContaining({ backgroundColor: '#4CAF50' }));
  });

  it('filters out hidden steps', () => {
    const store = createStore([
      { id: 'step1', title: 'Step 1', component: () => null },
      { id: 'step2', title: 'Step 2', hidden: true, component: () => null },
      { id: 'step3', title: 'Step 3', component: () => null }
    ]);
    const { getAllByTestId } = render(<StepIndicator store={store} />);
    const steps = getAllByTestId('step');
    expect(steps).toHaveLength(2);
  });

  it('renders custom step component', () => {
    const store = createStore();
    const CustomStep = ({ index }: { index: number }) => (
      <View testID="custom-step">
        <Text>Custom {index + 1}</Text>
      </View>
    );

    const { getAllByTestId } = render(
      <StepIndicator 
        store={store} 
        renderStep={({ index }) => <CustomStep index={index} />}
      />
    );

    const customSteps = getAllByTestId('custom-step');
    expect(customSteps).toHaveLength(3);
  });

  it('renders custom connector component', () => {
    const store = createStore();
    const CustomConnector = () => (
      <View testID="custom-connector" />
    );

    const { getAllByTestId } = render(
      <StepIndicator 
        store={store} 
        renderConnector={() => <CustomConnector />}
      />
    );

    const connectors = getAllByTestId('custom-connector');
    expect(connectors).toHaveLength(2);
  });

  it('shows checkmark for completed steps', () => {
    const store = createStore();
    store.completedSteps.push('step1');
    const { getByText } = render(<StepIndicator store={store} />);
    expect(getByText('✓')).toBeTruthy();
  });

  it('shows step number for non-completed steps', () => {
    const store = createStore();
    const { getAllByText } = render(<StepIndicator store={store} />);
    expect(getAllByText('1')).toHaveLength(1);
    expect(getAllByText('2')).toHaveLength(1);
    expect(getAllByText('3')).toHaveLength(1);
  });
}); 