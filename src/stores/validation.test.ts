/**
 * Validation tests to ensure MST and Zustand stores behave identically
 * This file compares the behavior of both implementations side by side
 */

import { renderHook, act } from '@testing-library/react-native';
import { WizardStore as MSTWizardStore } from './WizardStore';
import { useWizardStore, Step } from './WizardStore.zustand';

// Test data - using consistent labels
const testSteps = [
  {
    id: 'step1',
    order: 1,
    canMoveNext: true,
    nextLabel: 'Continue',
    previousLabel: 'Back',
  },
  {
    id: 'step2',
    order: 2,
    canMoveNext: false,
    nextLabel: 'Finish',
    previousLabel: 'Back',  // Use consistent label
  },
];

describe('MST vs Zustand Store Validation', () => {
  let mstStore: any;
  let zustandHook: ReturnType<typeof renderHook>;

  beforeEach(() => {
    // Create MST store
    mstStore = MSTWizardStore.create({
      steps: testSteps,
    });

    // Create Zustand store hook
    zustandHook = renderHook(() => useWizardStore());

    // Initialize the Zustand store with test steps
    act(() => {
      // Initialize with our test steps using the same labels as MST
      zustandHook.result.current.initializeSteps(
        testSteps.map(({ nextLabel, previousLabel, ...step }) => step),
        'Continue',
        'Back',  // Match MST's "Back" label
        'Finish'
      );
    });
  });

  describe('Initial State', () => {
    it('should have identical initial state', () => {
      const zustandStore = zustandHook.result.current;
      expect(mstStore.currentStepId).toBe(zustandStore.currentStepId);
      expect(mstStore.currentStepPosition).toBe(zustandStore.currentStepPosition);
      expect(mstStore.totalSteps).toBe(zustandStore.totalSteps);
      expect(mstStore.isLoading).toBe(zustandStore.isLoading);
      expect(mstStore.error).toBe(zustandStore.error);
      expect(mstStore.steps.length).toBe(zustandStore.steps.length);
    });

    it('should have identical computed properties', () => {
      const zustandStore = zustandHook.result.current;
      expect(mstStore.canMoveNext).toBe(zustandStore.canMoveNext);
      expect(mstStore.isFirstStep).toBe(zustandStore.isFirstStep);
      expect(mstStore.isLastStep).toBe(zustandStore.isLastStep);
      expect(mstStore.nextButtonLabel).toBe(zustandStore.nextButtonLabel);
      expect(mstStore.previousButtonLabel).toBe(zustandStore.previousButtonLabel);
    });
  });

  describe('Navigation Actions', () => {
    it('should behave identically when moving next', async () => {
      await mstStore.moveNext();
      await act(async () => {
        await zustandHook.result.current.moveNext();
      });

      const zustandStore = zustandHook.result.current;
      expect(mstStore.currentStepId).toBe(zustandStore.currentStepId);
      expect(mstStore.currentStepPosition).toBe(zustandStore.currentStepPosition);
      expect(mstStore.canMoveNext).toBe(zustandStore.canMoveNext);
      expect(mstStore.isFirstStep).toBe(zustandStore.isFirstStep);
      expect(mstStore.isLastStep).toBe(zustandStore.isLastStep);
    });

    it('should behave identically when setting current step', async () => {
      await mstStore.setCurrentStep('step2');
      await act(async () => {
        await zustandHook.result.current.setCurrentStep('step2');
      });

      const zustandStore = zustandHook.result.current;
      expect(mstStore.currentStepId).toBe(zustandStore.currentStepId);
      expect(mstStore.currentStepPosition).toBe(zustandStore.currentStepPosition);
      expect(mstStore.nextButtonLabel).toBe(zustandStore.nextButtonLabel);
      expect(mstStore.previousButtonLabel).toBe(zustandStore.previousButtonLabel);
    });
  });

  describe('Data Management', () => {
    it('should behave identically when setting step data', async () => {
      const testData = { name: 'John', email: 'john@example.com' };

      await mstStore.setStepData('step1', testData);
      await act(async () => {
        await zustandHook.result.current.setStepData('step1', testData);
      });

      const zustandStore = zustandHook.result.current;
      expect(mstStore.getStepData('step1')).toEqual(zustandStore.getStepData('step1'));
    });
  });

  describe('Helper Methods', () => {
    it('should return identical results for getStepById', () => {
      const zustandStore = zustandHook.result.current;
      const mstStep = mstStore.getStepById('step1');
      const zustandStep = zustandStore.getStepById('step1');

      expect(mstStep?.id).toBe(zustandStep?.id);
      expect(mstStep?.order).toBe(zustandStep?.order);
      expect(mstStep?.canMoveNext).toBe(zustandStep?.canMoveNext);
    });
  });
});
