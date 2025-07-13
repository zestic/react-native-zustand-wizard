import { useWizard } from '../context/WizardContext';
import { NavigationContext, StepContext } from '../types';

/**
 * Custom hook that provides step context for Zustand store
 * @param stepId The ID of the step
 * @returns A step context object with the step ID and helper functions
 */
export const useStepContext = (stepId: string): StepContext => {
  const store = useWizard();

  return {
    stepId,
    updateField: (field: string, value: unknown) => {
      store.updateField(stepId, field, value);
    },
    getStepData: () => {
      return store.getStepData(stepId);
    },
    canMoveNext: (canMoveNext: boolean) => {
      // Update the step's canMoveNext property using the new method
      store.updateStepProperty(stepId, 'canMoveNext', canMoveNext);
    },
  };
};

/**
 * Custom hook that provides navigation context for Zustand store
 * @returns Navigation context with state and actions
 */
export function useNavigationContext(): NavigationContext {
  const store = useWizard();

  return {
    isPreviousHidden: store.isFirstStep,
    isNextDisabled: !store.canMoveNext,
    nextLabel: store.nextButtonLabel,
    previousLabel: store.previousButtonLabel,
    currentStepPosition: store.currentStepPosition,
    totalSteps: store.totalSteps,
    onNext: async () => {
      await store.moveNext();
    },
    onPrevious: async () => {
      await store.moveBack();
    },
  };
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
