import { setWizardUtilsStore, updateField, useStepContext, resetStore } from './wizardUtils';
import { WizardStore } from '../stores/WizardStore';
import { renderHook, act } from '@testing-library/react-hooks';

// Mock the WizardStore with basic functionality
const mockWizardStore = {
  updateField: jest.fn(),
  getStepData: jest.fn().mockReturnValue({}),
  getStepById: jest.fn().mockReturnValue({
    setCanMoveNext: jest.fn(),
  }),
  getCurrentStep: jest.fn().mockReturnValue({
    canMoveNext: true,
    nextLabel: 'Next',
    previousLabel: 'Back',
  }),
  currentStepPosition: 1,
  totalSteps: 3,
  getCanMoveNext: jest.fn().mockReturnValue(true),
  moveNext: jest.fn(),
  moveBack: jest.fn(),
};

jest.mock('../stores/WizardStore', () => ({
  WizardStore: {
    create: jest.fn().mockImplementation(() => mockWizardStore),
  },
}));

describe('wizardUtils Base Tests', () => {
  let mockStore: any;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockStore = WizardStore.create({ steps: [] });
    resetStore();
  });

  afterEach(() => {
    resetStore();
  });

  describe('Store Initialization', () => {
    it('should initialize store reference successfully', () => {
      expect(() => setWizardUtilsStore(mockStore)).not.toThrow();
    });

    it('should throw when initializing with null store', () => {
      expect(() => setWizardUtilsStore(null as any))
        .toThrow('Cannot initialize with null store');
    });
  });

  describe('Field Updates', () => {
    it('should update field in initialized store', () => {
      setWizardUtilsStore(mockStore);
      updateField('step1', 'field1', 'value1');
      expect(mockStore.updateField).toHaveBeenCalledWith('step1', 'field1', 'value1');
    });

    it('should throw when updating field in uninitialized store', () => {
      resetStore();
      expect(() => updateField('step1', 'field1', 'value1'))
        .toThrow('Store not initialized');
    });
  });

  describe('Step Context Hook', () => {
    const TEST_STEP_ID = 'test-step-1';

    beforeEach(() => {
      setWizardUtilsStore(mockStore);
    });

    it('should provide step context with correct interface', () => {
      const { result } = renderHook(() => useStepContext(TEST_STEP_ID));
      
      expect(result.current).toEqual(expect.objectContaining({
        stepId: TEST_STEP_ID,
        updateField: expect.any(Function),
        getStepData: expect.any(Function),
        canMoveNext: expect.any(Function)
      }));
    });

    it('should handle field updates through context', () => {
      const { result } = renderHook(() => useStepContext(TEST_STEP_ID));
      
      act(() => {
        result.current.updateField('testField', 'testValue');
      });

      expect(mockStore.updateField).toHaveBeenCalledWith(
        TEST_STEP_ID,
        'testField',
        'testValue'
      );
    });

    it('should handle missing step gracefully', () => {
      mockStore.getStepById.mockReturnValueOnce(undefined);
      const { result } = renderHook(() => useStepContext('missing-step'));
      
      expect(result.current.canMoveNext).toBeInstanceOf(Function);
      expect(() => result.current.canMoveNext(true)).not.toThrow();
    });

    it('should handle step data retrieval', () => {
      const testData = { field1: 'value1' };
      mockStore.getStepData.mockReturnValue(testData);
      
      const { result } = renderHook(() => useStepContext(TEST_STEP_ID));
      const data = result.current.getStepData();
      
      expect(mockStore.getStepData).toHaveBeenCalledWith(TEST_STEP_ID);
      expect(data).toEqual(testData);
    });

    it('should throw when store is not initialized', () => {
      resetStore();
      const { result } = renderHook(() => useStepContext(TEST_STEP_ID));
      
      expect(() => result.current.updateField('field1', 'value1'))
        .toThrow('Store not initialized');
      expect(() => result.current.getStepData())
        .toThrow('Store not initialized');
      expect(() => result.current.canMoveNext(true))
        .toThrow('Store not initialized');
    });

    it('should update step canMoveNext state', () => {
      const mockStep = { setCanMoveNext: jest.fn() };
      mockStore.getStepById.mockReturnValue(mockStep);
      
      const { result } = renderHook(() => useStepContext(TEST_STEP_ID));
      
      act(() => {
        result.current.canMoveNext(true);
      });

      expect(mockStore.getStepById).toHaveBeenCalledWith(TEST_STEP_ID);
      expect(mockStep.setCanMoveNext).toHaveBeenCalledWith(true);

      act(() => {
        result.current.canMoveNext(false);
      });

      expect(mockStep.setCanMoveNext).toHaveBeenCalledWith(false);
    });
  });
});
