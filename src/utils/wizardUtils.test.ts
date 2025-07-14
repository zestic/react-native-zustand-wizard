import { renderHook, act } from '@testing-library/react-native';
import React from 'react';
import { useStepContext, useNavigationContext, updateField } from './wizardUtils';
import { useWizard } from '../context/WizardContext';

// Mock the WizardContext
jest.mock('../context/WizardContext', () => ({
  useWizard: jest.fn(),
}));

const mockUseWizard = useWizard as jest.Mock;

// Mock store for testing
const createMockStore = (overrides = {}) => ({
  currentStepId: 'step1',
  currentStepPosition: 1,
  totalSteps: 3,
  isLoading: false,
  error: '',
  canMoveNext: true,
  isFirstStep: true,
  isLastStep: false,
  nextButtonLabel: 'Next',
  previousButtonLabel: 'Previous',
  updateField: jest.fn(),
  getStepData: jest.fn(() => ({ name: 'test' })),
  updateStepProperty: jest.fn(),
  moveNext: jest.fn(),
  moveBack: jest.fn(),
  setLoading: jest.fn(),
  setError: jest.fn(),
  setStepData: jest.fn(),
  getStepById: jest.fn(),
  getWizardData: jest.fn(() => ({})),
  getNextStep: jest.fn(),
  getPreviousStep: jest.fn(),
  initializeSteps: jest.fn(),
  steps: [],
  ...overrides,
});

describe('wizardUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useStepContext', () => {
    it('should return step context with correct stepId', () => {
      const mockStore = createMockStore();
      mockUseWizard.mockReturnValue(mockStore);

      const { result } = renderHook(() => useStepContext('test-step'));

      expect(result.current.stepId).toBe('test-step');
    });

    it('should provide updateField function', () => {
      const mockStore = createMockStore();
      mockUseWizard.mockReturnValue(mockStore);

      const { result } = renderHook(() => useStepContext('test-step'));

      expect(typeof result.current.updateField).toBe('function');
    });

    it('should call store updateField when updateField is called', () => {
      const mockStore = createMockStore();
      mockUseWizard.mockReturnValue(mockStore);

      const { result } = renderHook(() => useStepContext('test-step'));

      act(() => {
        result.current.updateField('name', 'John Doe');
      });

      expect(mockStore.updateField).toHaveBeenCalledWith('test-step', 'name', 'John Doe');
    });

    it('should provide getStepData function', () => {
      const mockStore = createMockStore();
      mockUseWizard.mockReturnValue(mockStore);

      const { result } = renderHook(() => useStepContext('test-step'));

      expect(typeof result.current.getStepData).toBe('function');
    });

    it('should call store getStepData when getStepData is called', () => {
      const mockStore = createMockStore();
      mockUseWizard.mockReturnValue(mockStore);

      const { result } = renderHook(() => useStepContext('test-step'));

      const stepData = result.current.getStepData();

      expect(mockStore.getStepData).toHaveBeenCalledWith('test-step');
      expect(stepData).toEqual({ name: 'test' });
    });

    it('should provide canMoveNext function', () => {
      const mockStore = createMockStore();
      mockUseWizard.mockReturnValue(mockStore);

      const { result } = renderHook(() => useStepContext('test-step'));

      expect(typeof result.current.canMoveNext).toBe('function');
    });

    it('should call store updateStepProperty when canMoveNext is called', () => {
      const mockStore = createMockStore();
      mockUseWizard.mockReturnValue(mockStore);

      const { result } = renderHook(() => useStepContext('test-step'));

      act(() => {
        result.current.canMoveNext(true);
      });

      expect(mockStore.updateStepProperty).toHaveBeenCalledWith('test-step', 'canMoveNext', true);
    });

    it('should handle different step IDs', () => {
      const mockStore = createMockStore();
      mockUseWizard.mockReturnValue(mockStore);

      const { result: result1 } = renderHook(() => useStepContext('step1'));
      const { result: result2 } = renderHook(() => useStepContext('step2'));

      expect(result1.current.stepId).toBe('step1');
      expect(result2.current.stepId).toBe('step2');

      act(() => {
        result1.current.updateField('field1', 'value1');
        result2.current.updateField('field2', 'value2');
      });

      expect(mockStore.updateField).toHaveBeenCalledWith('step1', 'field1', 'value1');
      expect(mockStore.updateField).toHaveBeenCalledWith('step2', 'field2', 'value2');
    });

    it('should handle empty step ID', () => {
      const mockStore = createMockStore();
      mockUseWizard.mockReturnValue(mockStore);

      const { result } = renderHook(() => useStepContext(''));

      expect(result.current.stepId).toBe('');

      act(() => {
        result.current.updateField('field', 'value');
      });

      expect(mockStore.updateField).toHaveBeenCalledWith('', 'field', 'value');
    });
  });

  describe('useNavigationContext', () => {
    it('should return navigation context with correct values', () => {
      const mockStore = createMockStore({
        isFirstStep: true,
        canMoveNext: false,
        nextButtonLabel: 'Continue',
        previousButtonLabel: 'Go Back',
        currentStepPosition: 2,
        totalSteps: 5,
      });
      mockUseWizard.mockReturnValue(mockStore);

      const { result } = renderHook(() => useNavigationContext());

      expect(result.current.isPreviousHidden).toBe(true);
      expect(result.current.isNextDisabled).toBe(true);
      expect(result.current.nextLabel).toBe('Continue');
      expect(result.current.previousLabel).toBe('Go Back');
      expect(result.current.currentStepPosition).toBe(2);
      expect(result.current.totalSteps).toBe(5);
    });

    it('should provide onNext function', () => {
      const mockStore = createMockStore();
      mockUseWizard.mockReturnValue(mockStore);

      const { result } = renderHook(() => useNavigationContext());

      expect(typeof result.current.onNext).toBe('function');
    });

    it('should call store moveNext when onNext is called', async () => {
      const mockStore = createMockStore();
      mockUseWizard.mockReturnValue(mockStore);

      const { result } = renderHook(() => useNavigationContext());

      await act(async () => {
        await result.current.onNext();
      });

      expect(mockStore.moveNext).toHaveBeenCalledTimes(1);
    });

    it('should provide onPrevious function', () => {
      const mockStore = createMockStore();
      mockUseWizard.mockReturnValue(mockStore);

      const { result } = renderHook(() => useNavigationContext());

      expect(typeof result.current.onPrevious).toBe('function');
    });

    it('should call store moveBack when onPrevious is called', async () => {
      const mockStore = createMockStore();
      mockUseWizard.mockReturnValue(mockStore);

      const { result } = renderHook(() => useNavigationContext());

      await act(async () => {
        await result.current.onPrevious();
      });

      expect(mockStore.moveBack).toHaveBeenCalledTimes(1);
    });

    it('should handle async navigation functions', async () => {
      const mockStore = createMockStore({
        moveNext: jest.fn().mockResolvedValue(undefined),
        moveBack: jest.fn().mockResolvedValue(undefined),
      });
      mockUseWizard.mockReturnValue(mockStore);

      const { result } = renderHook(() => useNavigationContext());

      await act(async () => {
        await result.current.onNext();
        await result.current.onPrevious();
      });

      expect(mockStore.moveNext).toHaveBeenCalledTimes(1);
      expect(mockStore.moveBack).toHaveBeenCalledTimes(1);
    });

    it('should handle navigation errors gracefully', async () => {
      const mockStore = createMockStore({
        moveNext: jest.fn().mockRejectedValue(new Error('Navigation error')),
        moveBack: jest.fn().mockRejectedValue(new Error('Navigation error')),
      });
      mockUseWizard.mockReturnValue(mockStore);

      const { result } = renderHook(() => useNavigationContext());

      // Should not throw errors
      await act(async () => {
        try {
          await result.current.onNext();
        } catch (error) {
          // Expected to catch error
        }
      });

      await act(async () => {
        try {
          await result.current.onPrevious();
        } catch (error) {
          // Expected to catch error
        }
      });

      expect(mockStore.moveNext).toHaveBeenCalledTimes(1);
      expect(mockStore.moveBack).toHaveBeenCalledTimes(1);
    });

    it('should update when store values change', () => {
      const mockStore1 = createMockStore({ canMoveNext: true });
      const mockStore2 = createMockStore({ canMoveNext: false });

      mockUseWizard.mockReturnValueOnce(mockStore1);
      const { result, rerender } = renderHook(() => useNavigationContext());

      expect(result.current.isNextDisabled).toBe(false);

      // Simulate store change
      mockUseWizard.mockReturnValueOnce(mockStore2);
      rerender();

      expect(result.current.isNextDisabled).toBe(true);
    });
  });

  describe('updateField', () => {
    it('should throw error when called', () => {
      expect(() => {
        updateField('step1', 'field', 'value');
      }).toThrow('updateField should be used within components via useStepContext');
    });

    it('should throw error with correct message', () => {
      expect(() => {
        updateField('any-step', 'any-field', 'any-value');
      }).toThrow('updateField should be used within components via useStepContext');
    });

    it('should throw error regardless of parameters', () => {
      expect(() => {
        updateField('', '', '');
      }).toThrow('updateField should be used within components via useStepContext');

      expect(() => {
        updateField('step', 'field', null);
      }).toThrow('updateField should be used within components via useStepContext');

      expect(() => {
        updateField('step', 'field', undefined);
      }).toThrow('updateField should be used within components via useStepContext');

      expect(() => {
        updateField('step', 'field', { complex: 'object' });
      }).toThrow('updateField should be used within components via useStepContext');
    });
  });

  describe('Integration Tests', () => {
    it('should work together - step context and navigation context', () => {
      const mockStore = createMockStore();
      mockUseWizard.mockReturnValue(mockStore);

      const { result: stepResult } = renderHook(() => useStepContext('test-step'));
      const { result: navResult } = renderHook(() => useNavigationContext());

      expect(stepResult.current.stepId).toBe('test-step');
      expect(navResult.current.currentStepPosition).toBe(1);
      expect(navResult.current.totalSteps).toBe(3);
    });

    it('should handle multiple step contexts', () => {
      const mockStore = createMockStore();
      mockUseWizard.mockReturnValue(mockStore);

      const { result: step1 } = renderHook(() => useStepContext('step1'));
      const { result: step2 } = renderHook(() => useStepContext('step2'));

      act(() => {
        step1.current.updateField('name', 'John');
        step2.current.updateField('email', 'john@example.com');
      });

      expect(mockStore.updateField).toHaveBeenCalledWith('step1', 'name', 'John');
      expect(mockStore.updateField).toHaveBeenCalledWith('step2', 'email', 'john@example.com');
    });
  });
});
