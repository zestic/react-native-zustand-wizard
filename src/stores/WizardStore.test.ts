import { WizardStore } from './WizardStore';

interface TestStep {
  id: string;
  order: number;
  component: () => null;
  canMoveNext: boolean;
  nextLabel?: string;
  previousLabel?: string;
}

const defaultSteps: TestStep[] = [
  {
    id: 'step1',
    order: 1,
    component: () => null,
    canMoveNext: true,
    nextLabel: 'Next',
    previousLabel: 'Back',
  },
  {
    id: 'step2',
    order: 2,
    component: () => null,
    canMoveNext: true,
    nextLabel: 'Finish',
    previousLabel: 'Back',
  },
];

describe('WizardStore', () => {
  describe('initialization', () => {
    it('should create a store with default values', () => {
      const store = WizardStore.create({
        steps: defaultSteps.map((step) => ({
          id: step.id,
          order: step.order,
          canMoveNext: step.canMoveNext,
          nextLabel: step.nextLabel,
          previousLabel: step.previousLabel,
        })),
      });
      expect(store.currentStepId).toBe('step1');
      expect(store.currentStepPosition).toBe(1);
      expect(store.totalSteps).toBe(2);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe('');
    });

    it('should throw error if steps are not sequentially ordered', () => {
      const invalidSteps = [
        {
          id: 'step1',
          order: 1,
          component: () => null,
          canMoveNext: true,
        },
        {
          id: 'step2',
          order: 3,
          component: () => null,
          canMoveNext: true,
        },
      ];
      expect(() =>
        WizardStore.create({
          steps: invalidSteps.map((step) => ({
            id: step.id,
            order: step.order,
            canMoveNext: step.canMoveNext,
          })),
        })
      ).toThrow('Step orders must be sequential starting from 1');
    });

    it('should throw error if no steps are provided', () => {
      expect(() =>
        WizardStore.create({
          steps: [],
        })
      ).toThrow('Wizard must have at least one step');
    });
  });

  describe('views', () => {
    let store: any;

    beforeEach(() => {
      store = WizardStore.create({
        steps: defaultSteps.map((step) => ({
          id: step.id,
          order: step.order,
          canMoveNext: step.canMoveNext,
          nextLabel: step.nextLabel,
          previousLabel: step.previousLabel,
        })),
      });
    });

    it('should get step by id', () => {
      const step = store.getStepById('step1');
      expect(step).toBeTruthy();
      expect(step.id).toBe('step1');
    });

    it('should get step data', () => {
      store.setStepData('step1', { name: 'test' });
      expect(store.getStepData('step1')).toEqual({ name: 'test' });
    });

    it('should get wizard data', () => {
      store.setStepData('step1', { name: 'test' });
      store.setStepData('step2', { email: 'test@example.com' });
      expect(store.getWizardData()).toEqual({
        step1: { name: 'test' },
        step2: { email: 'test@example.com' },
      });
    });

    it('should check if can move next', () => {
      expect(store.getCanMoveNext()).toBe(true);
      store.steps[0].setCanMoveNext(false);
      expect(store.getCanMoveNext()).toBe(false);
    });

    it('should check if can move back', () => {
      expect(store.getCanMoveBack()).toBe(false);
      store.moveNext();
      expect(store.getCanMoveBack()).toBe(true);
    });

    it('should get next step', () => {
      const nextStep = store.getNextStep();
      expect(nextStep).toBeTruthy();
      expect(nextStep.id).toBe('step2');
    });

    it('should get previous step', () => {
      store.moveNext();
      const prevStep = store.getPreviousStep();
      expect(prevStep).toBeTruthy();
      expect(prevStep.id).toBe('step1');
    });

    it('should check if next button is disabled', () => {
      const config = store.getNavigationConfig();
      expect(config.isNextDisabled).toBe(false);
      store.steps[0].setCanMoveNext(false);
      const updatedConfig = store.getNavigationConfig();
      expect(updatedConfig.isNextDisabled).toBe(true);
    });

    it('should get next button label', () => {
      expect(store.nextButtonLabel).toBe('Next');
      store.moveNext();
      expect(store.nextButtonLabel).toBe('Finish');
    });

    it('should get previous button label', () => {
      expect(store.previousButtonLabel).toBe('Back');
    });
  });

  describe('actions', () => {
    let store: any;

    beforeEach(() => {
      store = WizardStore.create({
        steps: defaultSteps.map((step) => ({
          id: step.id,
          order: step.order,
          canMoveNext: step.canMoveNext,
          nextLabel: step.nextLabel,
          previousLabel: step.previousLabel,
        })),
      });
    });

    it('should set loading state', () => {
      store.setLoading(true);
      expect(store.isLoading).toBe(true);
      store.setLoading(false);
      expect(store.isLoading).toBe(false);
    });

    it('should set error state', () => {
      store.setError('Test error');
      expect(store.error).toBe('Test error');
      store.setError(null);
      expect(store.error).toBe('');
    });

    it('should set current step', async () => {
      await store.setCurrentStep('step2');
      expect(store.currentStepId).toBe('step2');
      expect(store.currentStepPosition).toBe(2);
    });

    it('should move to next step', async () => {
      await store.moveNext();
      expect(store.currentStepId).toBe('step2');
      expect(store.currentStepPosition).toBe(2);
    });

    it('should move to previous step', async () => {
      await store.moveNext();
      await store.moveBack();
      expect(store.currentStepId).toBe('step1');
      expect(store.currentStepPosition).toBe(1);
    });

    it('should set step data', async () => {
      await store.setStepData('step1', { name: 'test' });
      expect(store.getStepData('step1')).toEqual({ name: 'test' });
    });

    it('should update field', async () => {
      // First update
      await store.updateField('step1', 'name', 'test');
      const firstUpdate = store.getStepData('step1');
      expect(firstUpdate).toEqual({ name: 'test' });

      // Second update
      await store.updateField('step1', 'email', 'test@example.com');
      const secondUpdate = store.getStepData('step1');

      // Check if we still have both fields
      expect(secondUpdate.name).toBe('test');
      expect(secondUpdate.email).toBe('test@example.com');
    });

    it('should reset the store', async () => {
      await store.setStepData('step1', { name: 'test' });
      await store.moveNext();
      await store.reset();
      expect(store.currentStepId).toBe('step1');
      expect(store.currentStepPosition).toBe(1);
      expect(store.getStepData('step1')).toEqual({});
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe('');
    });
  });
});
