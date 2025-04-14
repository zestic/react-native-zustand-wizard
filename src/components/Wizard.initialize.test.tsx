import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Wizard } from './Wizard';
import { StepConfig } from '../types';
import { View, Text } from 'react-native';
import { WizardStore, WizardStoreType } from '../stores/WizardStore';
import { getSnapshot, SnapshotOut } from 'mobx-state-tree';

// Mock component for steps
const MockStepComponent = () => <View><Text>Step</Text></View>;

// Helper to get the store instance created within the Wizard
let internalStoreInstance: WizardStoreType | null = null;
jest.mock('../stores/WizardStore', () => {
  const actualStore = jest.requireActual('../stores/WizardStore');
  return {
    ...actualStore,
    WizardStore: {
      ...actualStore.WizardStore,
      create: jest.fn((snapshot) => {
        internalStoreInstance = actualStore.WizardStore.create(snapshot);
        return internalStoreInstance;
      }),
    },
  };
});

describe('Wizard Initialization', () => {
  beforeEach(() => {
    // Reset the mocked create function and the stored instance before each test
    (WizardStore.create as jest.Mock).mockClear();
    internalStoreInstance = null;
  });

  it('should apply default nextLabel and previousLabel from props', () => {
    const steps: StepConfig[] = [
      { id: 'step1', component: MockStepComponent, order: 1 },
      { id: 'step2', component: MockStepComponent, order: 2 },
    ];

    render(<Wizard steps={steps} nextLabel="Proceed" previousLabel="Go Back" />);

    expect(WizardStore.create).toHaveBeenCalledTimes(1);
    const storeSnapshot = getSnapshot(internalStoreInstance) as SnapshotOut<typeof WizardStore>;
    
    expect(storeSnapshot.steps[0].nextLabel).toBe('Proceed');
    expect(storeSnapshot.steps[1].previousLabel).toBe('Go Back');
  });

  it('should prioritize labels set directly in step config', () => {
    const steps: StepConfig[] = [
      { id: 'step1', component: MockStepComponent, order: 1, nextLabel: 'Step1 Next', previousLabel: 'Step1 Back' },
      { id: 'step2', component: MockStepComponent, order: 2 },
    ];

    render(<Wizard steps={steps} nextLabel="Default Next" previousLabel="Default Back" />);

    expect(WizardStore.create).toHaveBeenCalledTimes(1);
    const storeSnapshot = getSnapshot(internalStoreInstance) as SnapshotOut<typeof WizardStore>;

    expect(storeSnapshot.steps[0].nextLabel).toBe('Step1 Next');
    expect(storeSnapshot.steps[0].previousLabel).toBe('Step1 Back'); // First step still gets previousLabel processed
    expect(storeSnapshot.steps[1].nextLabel).toBe('Default Next'); // Second step uses default
  });

  it('should apply finishLabel to the last step if nextLabel is not set', () => {
    const steps: StepConfig[] = [
      { id: 'step1', component: MockStepComponent, order: 1 },
      { id: 'step2', component: MockStepComponent, order: 2 }, // No nextLabel here
    ];

    render(<Wizard steps={steps} nextLabel="Proceed" finishLabel="Complete" />);

    expect(WizardStore.create).toHaveBeenCalledTimes(1);
    const storeSnapshot = getSnapshot(internalStoreInstance) as SnapshotOut<typeof WizardStore>;

    expect(storeSnapshot.steps[0].nextLabel).toBe('Proceed'); // First step uses default next
    expect(storeSnapshot.steps[1].nextLabel).toBe('Complete'); // Last step uses finishLabel
  });

  it('should prioritize step nextLabel over finishLabel on the last step', () => {
    const steps: StepConfig[] = [
      { id: 'step1', component: MockStepComponent, order: 1 },
      { id: 'step2', component: MockStepComponent, order: 2, nextLabel: 'Finalize Step' }, // Specific label on last step
    ];

    render(<Wizard steps={steps} nextLabel="Proceed" finishLabel="Complete" />);

    expect(WizardStore.create).toHaveBeenCalledTimes(1);
    const storeSnapshot = getSnapshot(internalStoreInstance) as SnapshotOut<typeof WizardStore>;

    expect(storeSnapshot.steps[0].nextLabel).toBe('Proceed');
    expect(storeSnapshot.steps[1].nextLabel).toBe('Finalize Step'); // Step label takes precedence
  });

  it('should default canMoveNext to true if not provided', () => {
    const steps: StepConfig[] = [
      { id: 'step1', component: MockStepComponent, order: 1 }, // No canMoveNext
      { id: 'step2', component: MockStepComponent, order: 2, canMoveNext: false },
    ];

    render(<Wizard steps={steps} />);

    expect(WizardStore.create).toHaveBeenCalledTimes(1);
    const storeSnapshot = getSnapshot(internalStoreInstance) as SnapshotOut<typeof WizardStore>;

    expect(storeSnapshot.steps[0].canMoveNext).toBe(true);
    expect(storeSnapshot.steps[1].canMoveNext).toBe(false);
  });
}); 