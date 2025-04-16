import {
  setWizardUtilsStore,
  updateField,
  useStepContext,
  createNavigationConfig,
  useNavigationContext,
} from './wizardUtils';
import { WizardStore } from '../stores/WizardStore';
import { renderHook, act } from '@testing-library/react-hooks';

jest.mock('./wizardUtils', () => {
  const actual = jest.requireActual('./wizardUtils');
  return {
    ...actual,
    useNavigationContext: jest.fn(),
  };
});
const mockNav = require('./wizardUtils').useNavigationContext as jest.Mock;

// Mock the WizardStore
jest.mock('../stores/WizardStore', () => {
  return {
    WizardStore: {
      create: jest.fn().mockImplementation(() => ({
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
      })),
    },
  };
});

describe('wizardUtils', () => {
  let mockStore: any;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Create a mock store before each test
    mockStore = WizardStore.create({ steps: [] });
    // Set up console spies
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    // Reset module state
    jest.resetModules();
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clean up spies
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('setWizardUtilsStore', () => {
    it('initializes the store reference', () => {
      setWizardUtilsStore(mockStore);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('warns when trying to initialize with null store', () => {
      setWizardUtilsStore(null as any);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Cannot initialize with null store'
      );
    });
  });

  describe('updateField', () => {
    it('updates a field in the store', () => {
      setWizardUtilsStore(mockStore);
      updateField('step1', 'field1', 'value1');
      expect(mockStore.updateField).toHaveBeenCalledWith(
        'step1',
        'field1',
        'value1'
      );
    });

    it('logs error when store is not initialized', () => {
      // Re-import the module to get a fresh instance
      const { updateField: freshUpdateField } = require('./wizardUtils');
      freshUpdateField('step1', 'field1', 'value1');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Wizard store not initialized. Call setWizardUtilsStore first.'
      );
    });
  });

  describe('useStepContext', () => {
    it('returns step context with correct functions', () => {
      setWizardUtilsStore(mockStore);
      const { result } = renderHook(() => useStepContext('step1'));

      expect(result.current.stepId).toBe('step1');
      expect(typeof result.current.updateField).toBe('function');
      expect(typeof result.current.getStepData).toBe('function');
      expect(typeof result.current.canMoveNext).toBe('function');
    });

    it('calls store methods correctly', () => {
      setWizardUtilsStore(mockStore);
      const { result } = renderHook(() => useStepContext('step1'));

      // Test updateField
      act(() => {
        result.current.updateField('field1', 'value1');
      });
      expect(mockStore.updateField).toHaveBeenCalledWith(
        'step1',
        'field1',
        'value1'
      );

      // Test getStepData
      act(() => {
        result.current.getStepData();
      });
      expect(mockStore.getStepData).toHaveBeenCalledWith('step1');

      // Test canMoveNext
      act(() => {
        result.current.canMoveNext(true);
      });
      expect(mockStore.getStepById).toHaveBeenCalledWith('step1');
      const stepModel = mockStore.getStepById('step1');
      expect(stepModel.setCanMoveNext).toHaveBeenCalledWith(true);
    });
  });

  describe('createNavigationConfig', () => {
    it('returns correct config when store is set', () => {
      const store = {
        currentStepPosition: 1,
        totalSteps: 2,
        getCurrentStep: jest.fn().mockReturnValue({
          nextLabel: 'Next',
          previousLabel: 'Back',
          canMoveNext: false,
        }),
        getCanMoveNext: jest.fn().mockReturnValue(false),
        moveNext: jest.fn().mockResolvedValue(undefined),
        moveBack: jest.fn().mockResolvedValue(undefined),
      };
      setWizardUtilsStore(store as any);
      const config = createNavigationConfig();
      expect(config.isPreviousHidden).toBe(true);
      expect(config.isNextDisabled).toBe(true);
      expect(config.nextLabel).toBe('Next');
      expect(config.previousLabel).toBe('Back');
      expect(config.currentStepPosition).toBe(1);
      expect(config.totalSteps).toBe(2);
      expect(typeof config.onNext).toBe('function');
      expect(typeof config.onPrevious).toBe('function');
    });
  });

  describe('useNavigationContext', () => {
    it('returns correct config and updates when store changes', () => {
      mockNav.mockReturnValue({
        isPreviousHidden: true,
        isNextDisabled: true,
        nextLabel: 'Next',
        previousLabel: 'Back',
        currentStepPosition: 1,
        totalSteps: 2,
        onNext: jest.fn(),
        onPrevious: jest.fn(),
      });
      const { result, rerender } = renderHook(() => useNavigationContext());
      expect(result.current.isPreviousHidden).toBe(true);
      expect(result.current.isNextDisabled).toBe(true);
      expect(result.current.nextLabel).toBe('Next');
      expect(result.current.previousLabel).toBe('Back');
      expect(result.current.currentStepPosition).toBe(1);
      expect(result.current.totalSteps).toBe(2);

      // Simulate store update
      mockNav.mockReturnValue({
        isPreviousHidden: false,
        isNextDisabled: false,
        nextLabel: 'Next',
        previousLabel: 'Back',
        currentStepPosition: 2,
        totalSteps: 2,
        onNext: jest.fn(),
        onPrevious: jest.fn(),
      });
      rerender();
      expect(result.current.isPreviousHidden).toBe(false);
      expect(result.current.isNextDisabled).toBe(false);
      expect(result.current.currentStepPosition).toBe(2);
    });
  });
});
