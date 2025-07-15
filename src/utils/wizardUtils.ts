import { useCallback, useMemo } from 'react';
import { useWizard } from '../context/WizardContext';
import { NavigationContext, StepContext } from '../types';

/**
 * Custom hook that provides step context for Zustand store
 * @param stepId The ID of the step
 * @returns A step context object with the step ID and helper functions
 */
export const useStepContext = (stepId: string): StepContext => {
  const store = useWizard();

  // Memoize functions to prevent infinite loops in useEffect dependencies
  const updateField = useCallback(
    (field: string, value: unknown) => {
      store.updateField(stepId, field, value);
    },
    [store, stepId]
  );

  const getStepData = useCallback(() => {
    return store.getStepData(stepId);
  }, [store, stepId]);

  const canMoveNext = useCallback(
    (canMove: boolean) => {
      // Only update if the value actually changed to prevent unnecessary re-renders
      const currentStep = store.getStepById(stepId);
      if (currentStep && currentStep.canMoveNext !== canMove) {
        store.updateStepProperty(stepId, 'canMoveNext', canMove);
      }
    },
    [store, stepId]
  );

  return useMemo(
    () => ({
      stepId,
      updateField,
      getStepData,
      canMoveNext,
    }),
    [stepId, updateField, getStepData, canMoveNext]
  );
};

/**
 * Custom hook that provides navigation context for Zustand store
 * @returns Navigation context with state and actions
 */
export function useNavigationContext(): NavigationContext {
  const store = useWizard();

  // Memoize navigation functions to prevent unnecessary re-renders
  const onNext = useCallback(async () => {
    await store.moveNext();
  }, [store]);

  const onPrevious = useCallback(async () => {
    await store.moveBack();
  }, [store]);

  return useMemo(
    () => ({
      isPreviousHidden: store.isFirstStep,
      isNextDisabled: !store.canMoveNext,
      nextLabel: store.nextButtonLabel,
      previousLabel: store.previousButtonLabel,
      currentStepPosition: store.currentStepPosition,
      totalSteps: store.totalSteps,
      onNext,
      onPrevious,
    }),
    [
      store.isFirstStep,
      store.canMoveNext,
      store.nextButtonLabel,
      store.previousButtonLabel,
      store.currentStepPosition,
      store.totalSteps,
      onNext,
      onPrevious,
    ]
  );
}

/**
 * Update a field in the wizard store (Zustand version)
 * @param stepId The ID of the step to update
 * @param field The field name to update
 * @param value The new value for the field
 */
export const updateField = (
  _stepId: string,
  _field: string,
  _value: unknown
): void => {
  // This function is meant to be used outside of React components
  // For Zustand, we'll need to access the store differently
  // We'll need to modify this approach or use the store directly
  throw new Error(
    'updateField should be used within components via useStepContext'
  );
};
