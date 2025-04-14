import { types, flow } from 'mobx-state-tree';
import { WizardStore } from './WizardStore';
import { StepConfig } from '../types';

describe('WizardStore', () => {
  const defaultSteps: StepConfig[] = [
    { id: 'step1', title: 'Step 1', component: () => null, order: 1 },
    { id: 'step2', title: 'Step 2', component: () => null, order: 2 },
    { id: 'step3', title: 'Step 3', component: () => null, order: 3 }
  ];

  const createTestStore = (steps = defaultSteps, currentStepId = '') => {
    return WizardStore.create({
      currentStepId,
      steps,
      stepData: {},
      isLoading: false,
      error: undefined
    });
  };

  describe('Initialization', () => {
    it('should initialize to first step by order when no currentStepId is provided', () => {
      const store = createTestStore();
      expect(store.currentStepId).toBe('step1');
      expect(store.currentStepPosition).toBe(1);
      expect(store.totalSteps).toBe(3);
    });

    it('should initialize to provided step when currentStepId is provided', () => {
      const store = createTestStore(defaultSteps, 'step2');
      expect(store.currentStepId).toBe('step2');
      expect(store.currentStepPosition).toBe(2);
      expect(store.totalSteps).toBe(3);
    });

    it('should throw error when no steps are provided', () => {
      expect(() => createTestStore([])).toThrow('Wizard must have at least one step');
    });

    it('should set totalSteps to match the number of steps provided', () => {
      const store = createTestStore([defaultSteps[0]]);
      expect(store.totalSteps).toBe(1);
    });
  });

  describe('Navigation', () => {
    it('should move to next step', async () => {
      const store = createTestStore(defaultSteps, 'step1');
      await store.moveNext();
      expect(store.currentStepId).toBe('step2');
      expect(store.currentStepPosition).toBe(2);
    });

    it('should move to previous step', async () => {
      const store = createTestStore(defaultSteps, 'step2');
      await store.moveBack();
      expect(store.currentStepId).toBe('step1');
      expect(store.currentStepPosition).toBe(1);
    });

    it('should not move next on last step', async () => {
      const store = createTestStore(defaultSteps, 'step3');
      await store.moveNext();
      expect(store.currentStepId).toBe('step3');
      expect(store.currentStepPosition).toBe(3);
    });

    it('should not move back on first step', async () => {
      const store = createTestStore(defaultSteps, 'step1');
      await store.moveBack();
      expect(store.currentStepId).toBe('step1');
      expect(store.currentStepPosition).toBe(1);
    });

    it('should throw error for non-sequential order numbers', () => {
      const nonSequentialSteps: StepConfig[] = [
        { id: 'step1', title: 'Step 1', component: () => null, order: 1 },
        { id: 'step2', title: 'Step 2', component: () => null, order: 3 },
        { id: 'step3', title: 'Step 3', component: () => null, order: 5 }
      ];
      
      expect(() => createTestStore(nonSequentialSteps)).toThrow(
        'Step orders must be sequential starting from 1. Found order 3 at index 1'
      );
    });
  });

  describe('Views', () => {
    it('should get current step', () => {
      const store = createTestStore(defaultSteps, 'step2');
      const currentStep = store.getCurrentStep();
      expect(currentStep).toBeDefined();
      expect(currentStep?.id).toBe('step2');
    });

    it('should get step data', () => {
      const store = createTestStore(defaultSteps, 'step1');
      store.setStepData('step1', { field1: 'value1' });
      const stepData = store.getStepData('step1');
      expect(stepData).toEqual({ field1: 'value1' });
    });

    it('should determine if can move next', () => {
      const store = createTestStore(defaultSteps, 'step1');
      expect(store.getCanMoveNext()).toBe(true);
    });

    it('should determine if can move back', () => {
      const store = createTestStore(defaultSteps, 'step2');
      expect(store.getCanMoveBack()).toBe(true);
    });
  });

  describe('Data Management', () => {
    it('should set step data', async () => {
      const store = createTestStore();
      await store.setStepData('step1', { field1: 'value1' });
      expect(store.getStepData('step1')).toEqual({ field1: 'value1' });
    });

    it('should update field', async () => {
      const store = createTestStore();
      await store.setStepData('step1', { field1: 'value1' });
      await store.updateField('step1', 'field1', 'value2');
      expect(store.getStepData('step1')).toEqual({ field1: 'value2' });
    });
  });

  describe('Error Handling', () => {
    it('should set and clear error', async () => {
      const store = createTestStore();
      await store.setError('Test error');
      expect(store.error).toBe('Test error');
      await store.setError(null);
      expect(store.error).toBeUndefined();
    });
  });

  describe('Loading State', () => {
    it('should set loading state', async () => {
      const store = createTestStore();
      await store.setLoading(true);
      expect(store.isLoading).toBe(true);
      await store.setLoading(false);
      expect(store.isLoading).toBe(false);
    });
  });
});

