import { renderHook, act } from '@testing-library/react-hooks';
import { WizardStore } from '../stores/WizardStore';
import { setWizardUtilsStore, useNavigationContext } from './wizardUtils';

describe('useNavigationContext', () => {
  beforeEach(() => {
    // Reset the store before each test
    try {
      setWizardUtilsStore(null as any);
    } catch (e) {
      // Ignore error when resetting store
    }
  });

  it('should return default values when store is not initialized', () => {
    const { result } = renderHook(() => useNavigationContext());

    expect(result.current).toEqual({
      isPreviousHidden: false,
      isNextDisabled: false, // When store is null, canMoveNext defaults to true
      nextLabel: '',
      previousLabel: '',
      currentStepPosition: 0,
      totalSteps: 0,
      onNext: expect.any(Function),
      onPrevious: expect.any(Function),
    });
  });

  it('should update when store values change', async () => {
    // Create a store with initial values
    const store = WizardStore.create({
      currentStepPosition: 1,
      steps: [
        { id: 'step1', order: 1, canMoveNext: true },
        {
          id: 'step2',
          order: 2,
          canMoveNext: false,
          nextLabel: 'Onward',
          previousLabel: 'Backward',
        },
      ],
    });
    setWizardUtilsStore(store);

    const { result } = renderHook(() => useNavigationContext());

    // Initial values
    expect(result.current).toEqual({
      isPreviousHidden: true,
      isNextDisabled: false,
      nextLabel: 'Next',
      previousLabel: 'Previous',
      currentStepPosition: 1,
      totalSteps: 2,
      onNext: expect.any(Function),
      onPrevious: expect.any(Function),
    });

    // Update store values
    await act(async () => {
      await store.setCurrentStep('step2');
      // Give the hook time to sync with store
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Debug store state
    console.log('Store state after setCurrentStep:', {
      currentStepId: store.currentStepId,
      currentStepPosition: store.currentStepPosition,
      isFirstStep: store.isFirstStep,
      canMoveNext: store.canMoveNext,
      nextButtonLabel: store.nextButtonLabel,
      previousButtonLabel: store.previousButtonLabel,
    });

    // Debug hook state
    console.log('Hook state:', result.current);

    // Values should reflect changes
    expect(result.current).toEqual({
      isPreviousHidden: false,
      isNextDisabled: true, // Second step cannot move next
      nextLabel: 'Onward',
      previousLabel: 'Backward',
      currentStepPosition: 2,
      totalSteps: 2,
      onNext: expect.any(Function),
      onPrevious: expect.any(Function),
    });
  });

  it('should call store methods when onNext/onPrevious are called', async () => {
    // Create a store with spy methods
    const store = WizardStore.create({
      currentStepPosition: 2,
      steps: [
        { id: 'step1', order: 1, canMoveNext: true },
        { id: 'step2', order: 2, canMoveNext: true },
        { id: 'step3', order: 3, canMoveNext: false },
      ],
    });

    // Spy on store methods
    const moveNextSpy = jest.spyOn(store, 'moveNext');
    const moveBackSpy = jest.spyOn(store, 'moveBack');

    setWizardUtilsStore(store);

    const { result } = renderHook(() => useNavigationContext());

    // Call onNext
    await act(async () => {
      await result.current.onNext();
    });
    expect(moveNextSpy).toHaveBeenCalledTimes(1);

    // Call onPrevious
    await act(async () => {
      await result.current.onPrevious();
    });
    expect(moveBackSpy).toHaveBeenCalledTimes(1);
  });

  it('should handle custom button labels', () => {
    const store = WizardStore.create({
      currentStepPosition: 1,
      steps: [
        {
          id: 'step1',
          order: 1,
          canMoveNext: true,
          nextLabel: 'Continue',
          previousLabel: 'Go Back',
        },
      ],
    });
    setWizardUtilsStore(store);

    const { result } = renderHook(() => useNavigationContext());

    expect(result.current.nextLabel).toBe('Continue');
    expect(result.current.previousLabel).toBe('Go Back');
  });
});
