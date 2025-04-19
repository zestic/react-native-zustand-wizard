import { useMemo } from 'react';
import { autorun } from 'mobx';
import { useSyncExternalStore } from 'react';
import { WizardStoreType } from '../stores/WizardStore';
import { NavigationContext, StepContext } from 'types';

class WizardStoreError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WizardStoreError';
  }
}

let wizardStore: WizardStoreType | null = null;

/**
 * Reset the store to null (for testing only)
 * @internal
 */
export function resetStore(): void {
  wizardStore = null;
}

/**
 * Initialize the wizard store reference
 * @param store The wizard store instance
 * @throws {WizardStoreError} When store is null
 */
export function setWizardUtilsStore(store: WizardStoreType): void {
  if (!store) {
    throw new WizardStoreError('Cannot initialize with null store');
  }
  wizardStore = store;
}

/**
 * Update a field in the wizard store
 * @param stepId The ID of the step to update
 * @param field The field name to update
 * @param value The new value for the field
 */
export const updateField = (
  stepId: string,
  field: string,
  value: unknown
): void => {
  if (!wizardStore) {
    throw new WizardStoreError('Store not initialized');
  }

  wizardStore.updateField(stepId, field, value);
};

/**
 * Custom hook that provides step context
 * @param stepId The ID of the step
 * @returns A step context object with the step ID and helper functions
 */
export const useStepContext = (stepId: string): StepContext => {
  // Subscribe to changes in the wizardStore
  const subscribe = (callback: () => void) => {
    if (!wizardStore) return () => {};
    const store = wizardStore;
    const disposer = autorun(() => {
      // Track essential values and trigger callback when they change
      const _stepData = store.getStepData(stepId);
      // eslint-disable-next-line no-void
      void _stepData;
      callback();
    });
    return disposer;
  };

  // Memoize the step data
  const stepData = useMemo(() => {
    if (!wizardStore) {
      return {};
    }
    return wizardStore.getStepData(stepId) || {};
  }, [stepId]);

  // Get the current step data
  const getSnapshot = () => stepData;

  // Use useSyncExternalStore for reactivity
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  // Return the step context with safe access to store methods
  return {
    stepId,
    updateField: (field: string, value: unknown) => {
      if (!wizardStore) {
        throw new WizardStoreError('Store not initialized');
      }
      wizardStore.updateField(stepId, field, value);
    },
    getStepData: () => {
      if (!wizardStore) {
        throw new WizardStoreError('Store not initialized');
      }
      return wizardStore.getStepData(stepId);
    },
    canMoveNext: (canMoveNext: boolean) => {
      if (!wizardStore) {
        throw new WizardStoreError('Store not initialized');
      }
      const currentStep = wizardStore.getStepById(stepId);
      if (currentStep) {
        currentStep.setCanMoveNext(canMoveNext);
      }
    },
  };
};

export function useNavigationContext(): NavigationContext {
  // Subscribe to changes in the wizardStore
  const subscribe = (callback: () => void) => {
    if (!wizardStore) return () => {};
    const store = wizardStore;
    const disposer = autorun(() => {
      // Track essential values and trigger callback when they change
      const _currentStepPosition = store.currentStepPosition;
      const _canMoveNext = store.canMoveNext;
      const _nextLabel = store.nextButtonLabel;
      const _previousLabel = store.previousButtonLabel;
      const _totalSteps = store.totalSteps;
      // eslint-disable-next-line no-void
      void _currentStepPosition;
      // eslint-disable-next-line no-void
      void _canMoveNext;
      // eslint-disable-next-line no-void
      void _nextLabel;
      // eslint-disable-next-line no-void
      void _previousLabel;
      // eslint-disable-next-line no-void
      void _totalSteps;
      callback();
    });
    return disposer;
  };

  // Memoize the navigation config
  const navigationConfig = useMemo(() => {
    if (!wizardStore) {
      return {
        isPreviousHidden: false,
        isNextDisabled: true,
        nextLabel: '',
        previousLabel: '',
        currentStepPosition: 0,
        totalSteps: 0,
      };
    }

    return {
      currentStepPosition: wizardStore.currentStepPosition,
      isNextDisabled: !wizardStore.canMoveNext,
      isPreviousHidden: wizardStore.isFirstStep,
      nextLabel: wizardStore.nextButtonLabel,
      previousLabel: wizardStore.previousButtonLabel,
      totalSteps: wizardStore.totalSteps,
    };
  }, []);

  const getSnapshot = () => navigationConfig;

  // Use useSyncExternalStore to handle updates
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return {
    isPreviousHidden: wizardStore?.isFirstStep ?? false,
    isNextDisabled: !(wizardStore?.canMoveNext ?? true),
    nextLabel: wizardStore?.nextButtonLabel ?? '',
    previousLabel: wizardStore?.previousButtonLabel ?? '',
    currentStepPosition: wizardStore?.currentStepPosition ?? 0,
    totalSteps: wizardStore?.totalSteps ?? 0,
    onNext: async () => {
      if (!wizardStore) return;
      await wizardStore.moveNext();
    },
    onPrevious: async () => {
      if (!wizardStore) return;
      await wizardStore.moveBack();
    },
  };
}
