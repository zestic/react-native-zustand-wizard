import {
  setWizardUtilsStore,
  useNavigationContext,
  useStepContext,
} from './wizardUtils';
import { renderHook, act } from '@testing-library/react-hooks';

describe('wizardUtils Integration Tests', () => {
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let store: any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    try {
      setWizardUtilsStore(null as any);
    } catch (e) {
      // Ignore error when resetting store
    }
  });

  describe('Navigation Configuration', () => {
    it('should handle single step wizard', () => {
      // Setup store before initializing hook
      store = {
        currentStepPosition: 0,
        totalSteps: 1,
        getCurrentStep: jest.fn().mockReturnValue({
          canMoveNext: false,
          nextLabel: 'Finish',
          previousLabel: 'Back',
        }),
        getNavigationConfig: jest.fn().mockReturnValue({
          isPreviousHidden: true,
          isNextDisabled: true,
          nextLabel: 'Finish',
          previousLabel: 'Back',
          currentStepPosition: 0,
          totalSteps: 1,
          onNext: expect.any(Function),
          onPrevious: expect.any(Function),
        }),
      };
      setWizardUtilsStore(store);

      const { result } = renderHook(() => useNavigationContext());

      expect(result.current).toEqual({
        isPreviousHidden: false,
        isNextDisabled: false,
        nextLabel: '',
        previousLabel: '',
        currentStepPosition: 0,
        totalSteps: 1,
        onNext: expect.any(Function),
        onPrevious: expect.any(Function),
      });
    });

    it('should handle middle step in multi-step wizard', () => {
      // Setup store before initializing hook
      store = {
        currentStepPosition: 1,
        totalSteps: 3,
        getCurrentStep: jest.fn().mockReturnValue({
          canMoveNext: true,
          nextLabel: 'Continue',
          previousLabel: 'Back',
        }),
        getNavigationConfig: jest.fn().mockReturnValue({
          isPreviousHidden: false,
          isNextDisabled: false,
          nextLabel: 'Continue',
          previousLabel: 'Back',
          currentStepPosition: 1,
          totalSteps: 3,
          onNext: expect.any(Function),
          onPrevious: expect.any(Function),
        }),
      };
      setWizardUtilsStore(store);

      const { result } = renderHook(() => useNavigationContext());

      expect(result.current).toEqual({
        isPreviousHidden: false,
        isNextDisabled: false,
        nextLabel: '',
        previousLabel: '',
        currentStepPosition: 1,
        totalSteps: 3,
        onNext: expect.any(Function),
        onPrevious: expect.any(Function),
      });
    });
  });

  describe('Step Context', () => {
    it('should update canMoveNext state on the step', () => {
      const TEST_STEP_ID = 'test-step';
      const mockStep = {
        canMoveNext: false,
        setCanMoveNext: jest.fn(function (this: any, value: boolean) {
          this.canMoveNext = value;
        }),
      };
      store = {
        currentStepPosition: 1,
        totalSteps: 2,
        getCurrentStep: jest.fn().mockReturnValue(mockStep),
        getStepById: jest.fn().mockReturnValue(mockStep),
        getStepData: jest.fn().mockReturnValue({}),
      };
      setWizardUtilsStore(store);

      // Initial state
      const { result } = renderHook(() => useStepContext(TEST_STEP_ID));
      expect(mockStep.canMoveNext).toBe(false);

      // Update canMoveNext to true using the hook
      act(() => {
        result.current.canMoveNext(true);
      });

      // Step should now be updated
      expect(mockStep.canMoveNext).toBe(true);
      expect(mockStep.setCanMoveNext).toHaveBeenCalledWith(true);
    });
  });

  describe('Navigation Actions', () => {
    beforeEach(() => {
      // Setup store with navigation actions
      store = {
        currentStepPosition: 1,
        totalSteps: 3,
        getCurrentStep: jest.fn().mockReturnValue({
          canMoveNext: true,
          nextLabel: 'Next',
          previousLabel: 'Back',
        }),
        getNavigationConfig: jest.fn().mockReturnValue({
          isPreviousHidden: false,
          isNextDisabled: false,
          nextLabel: 'Next',
          previousLabel: 'Back',
          currentStepPosition: 1,
          totalSteps: 3,
          onNext: async () => store.moveNext(),
          onPrevious: async () => store.moveBack(),
        }),
        moveNext: jest.fn().mockResolvedValue(undefined),
        moveBack: jest.fn().mockResolvedValue(undefined),
      };
      setWizardUtilsStore(store);
    });

    it('should handle next/previous navigation', async () => {
      const { result } = renderHook(() => useNavigationContext());

      await act(async () => {
        await result.current.onNext();
      });
      expect(store.moveNext).toHaveBeenCalledTimes(1);

      await act(async () => {
        await result.current.onPrevious();
      });
      expect(store.moveBack).toHaveBeenCalledTimes(1);
    });
  });
});
