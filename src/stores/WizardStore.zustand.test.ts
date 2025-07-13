import { renderHook, act } from '@testing-library/react-native';
import { useWizardStore, Step } from './WizardStore.zustand';

// Test data
const defaultSteps: Omit<Step, 'nextLabel' | 'previousLabel'>[] = [
  {
    id: 'step1',
    order: 1,
    canMoveNext: true,
  },
  {
    id: 'step2',
    order: 2,
    canMoveNext: true,
  },
];

// Helper to create a fresh store for each test
const createTestStore = () => {
  const { result } = renderHook(() => useWizardStore());
  return result;
};

describe('WizardStore (Zustand)', () => {
  describe('initialization', () => {
    it('should create a store with default values', () => {
      const store = createTestStore();
      
      act(() => {
        store.current.initializeSteps(defaultSteps);
      });

      expect(store.current.currentStepId).toBe('step1');
      expect(store.current.currentStepPosition).toBe(1);
      expect(store.current.totalSteps).toBe(2);
      expect(store.current.isLoading).toBe(false);
      expect(store.current.error).toBe('');
    });

    it('should throw error if steps are not sequentially ordered', () => {
      const store = createTestStore();
      const invalidSteps = [
        {
          id: 'step1',
          order: 1,
          canMoveNext: true,
        },
        {
          id: 'step2',
          order: 3, // Invalid - should be 2
          canMoveNext: true,
        },
      ];

      expect(() => {
        act(() => {
          store.current.initializeSteps(invalidSteps);
        });
      }).toThrow('Step orders must be sequential starting from 1');
    });

    it('should throw error if no steps are provided', () => {
      const store = createTestStore();

      expect(() => {
        act(() => {
          store.current.initializeSteps([]);
        });
      }).toThrow('Wizard must have at least one step');
    });
  });

  describe('views/selectors', () => {
    let store: ReturnType<typeof createTestStore>;

    beforeEach(() => {
      store = createTestStore();
      act(() => {
        store.current.initializeSteps(defaultSteps);
      });
    });

    it('should get step by id', () => {
      const step = store.current.getStepById('step1');
      expect(step).toBeTruthy();
      expect(step?.id).toBe('step1');
    });

    it('should get step data', async () => {
      await act(async () => {
        await store.current.setStepData('step1', { name: 'test' });
      });
      expect(store.current.getStepData('step1')).toEqual({ name: 'test' });
    });

    it('should get wizard data', async () => {
      await act(async () => {
        await store.current.setStepData('step1', { name: 'test' });
        await store.current.setStepData('step2', { email: 'test@example.com' });
      });
      expect(store.current.getWizardData()).toEqual({
        step1: { name: 'test' },
        step2: { email: 'test@example.com' },
      });
    });

    it('should check if can move next', () => {
      expect(store.current.canMoveNext).toBe(true);
      
      // Update step to not allow moving next
      act(() => {
        const updatedSteps = store.current.steps.map(step => 
          step.id === 'step1' ? { ...step, canMoveNext: false } : step
        );
        store.current.initializeSteps(updatedSteps);
      });
      
      expect(store.current.canMoveNext).toBe(false);
    });

    it('should get next step', () => {
      const nextStep = store.current.getNextStep();
      expect(nextStep).toBeTruthy();
      expect(nextStep?.id).toBe('step2');
    });

    it('should get previous step', async () => {
      await act(async () => {
        await store.current.moveNext();
      });
      const prevStep = store.current.getPreviousStep();
      expect(prevStep).toBeTruthy();
      expect(prevStep?.id).toBe('step1');
    });

    it('should get next button label', () => {
      expect(store.current.nextButtonLabel).toBe('Next');
    });

    it('should get previous button label', () => {
      expect(store.current.previousButtonLabel).toBe('Previous');
    });

    it('should check if is first step', () => {
      expect(store.current.isFirstStep).toBe(true);
    });

    it('should check if is last step', async () => {
      await act(async () => {
        await store.current.moveNext();
      });
      expect(store.current.isLastStep).toBe(true);
    });
  });

  describe('actions', () => {
    let store: ReturnType<typeof createTestStore>;

    beforeEach(() => {
      store = createTestStore();
      act(() => {
        store.current.initializeSteps(defaultSteps);
      });
    });

    it('should set loading state', () => {
      act(() => {
        store.current.setLoading(true);
      });
      expect(store.current.isLoading).toBe(true);
      
      act(() => {
        store.current.setLoading(false);
      });
      expect(store.current.isLoading).toBe(false);
    });

    it('should set error state', () => {
      act(() => {
        store.current.setError('Test error');
      });
      expect(store.current.error).toBe('Test error');
      
      act(() => {
        store.current.setError(null);
      });
      expect(store.current.error).toBe('');
    });

    it('should set current step', async () => {
      await act(async () => {
        await store.current.setCurrentStep('step2');
      });
      expect(store.current.currentStepId).toBe('step2');
      expect(store.current.currentStepPosition).toBe(2);
    });

    it('should move to next step', async () => {
      await act(async () => {
        await store.current.moveNext();
      });
      expect(store.current.currentStepId).toBe('step2');
      expect(store.current.currentStepPosition).toBe(2);
    });

    it('should move to previous step', async () => {
      await act(async () => {
        await store.current.moveNext();
        await store.current.moveBack();
      });
      expect(store.current.currentStepId).toBe('step1');
      expect(store.current.currentStepPosition).toBe(1);
    });

    it('should set step data', async () => {
      await act(async () => {
        await store.current.setStepData('step1', { name: 'test' });
      });
      expect(store.current.getStepData('step1')).toEqual({ name: 'test' });
    });

    it('should update field', async () => {
      await act(async () => {
        await store.current.setStepData('step1', { name: 'test' });
        await store.current.updateField('step1', 'email', 'test@example.com');
      });
      expect(store.current.getStepData('step1')).toEqual({
        name: 'test',
        email: 'test@example.com',
      });
    });

    it('should reset the store', async () => {
      await act(async () => {
        await store.current.setStepData('step1', { name: 'test' });
        await store.current.moveNext();
        await store.current.reset();
      });
      expect(store.current.currentStepId).toBe('step1');
      expect(store.current.currentStepPosition).toBe(1);
      expect(store.current.getStepData('step1')).toEqual({});
      expect(store.current.isLoading).toBe(false);
      expect(store.current.error).toBe('');
    });

    it('should handle setStepData with invalid step id', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      await act(async () => {
        await store.current.setStepData('invalid-step', { name: 'test' });
      });
      expect(consoleSpy).toHaveBeenCalledWith('Step with id invalid-step not found');
      consoleSpy.mockRestore();
    });
  });

  describe('step initialization with custom labels', () => {
    it('should initialize steps with custom labels', () => {
      const store = createTestStore();
      
      act(() => {
        store.current.initializeSteps(
          defaultSteps,
          'Continue',
          'Go Back',
          'Complete'
        );
      });

      expect(store.current.nextButtonLabel).toBe('Continue');
      expect(store.current.previousButtonLabel).toBe('Go Back');
      
      // Move to last step to check finish label
      act(() => {
        store.current.moveNext();
      });
      expect(store.current.nextButtonLabel).toBe('Complete');
    });
  });
});
