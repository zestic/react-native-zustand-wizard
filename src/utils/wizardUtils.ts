import { useMemo } from 'react';
import { Instance } from 'mobx-state-tree';
import { autorun } from 'mobx';
import { useSyncExternalStore } from 'react';
import { WizardStore } from '../stores/WizardStore';

// Define the WizardStoreType
export type WizardStoreType = Instance<typeof WizardStore>;

// Define the step context type
export interface StepContext {
  stepId: string;
  updateField: (field: string, value: any) => void;
  getStepData: () => any;
  canMoveNext: (canMoveNext: boolean) => void;
}

let wizardStore: WizardStoreType | null = null;

/**
 * Initialize the wizard store reference
 * @param store The wizard store instance
 */
export function setWizardUtilsStore(store: WizardStoreType) {
  if (!store) {
    console.warn('Cannot initialize with null store');
    return;
  }
  wizardStore = store;
}

/**
 * Update a field in the wizard store
 * @param stepId The ID of the step to update
 * @param field The field name to update
 * @param value The new value for the field
 */
export const updateField = (stepId: string, field: string, value: any) => {
  if (!wizardStore) {
    console.error(
      'Wizard store not initialized. Call setWizardUtilsStore first.'
    );
    return;
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
      // Only track essential values
      store.getStepData(stepId);
      const currentStep = store.getStepById(stepId);
      currentStep?.canMoveNext;
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
  }, [stepId, wizardStore?.getStepData(stepId)]);

  // Get the current step data
  const getSnapshot = () => stepData;

  // Use useSyncExternalStore for reactivity
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  // Return the step context with safe access to store methods
  return {
    stepId,
    updateField: (field: string, value: any) => {
      if (!wizardStore) {
        console.warn('Store not initialized');
        return;
      }
      wizardStore.updateField(stepId, field, value);
    },
    getStepData: () => {
      if (!wizardStore) {
        console.warn('Store not initialized');
        return {};
      }
      return wizardStore.getStepData(stepId) || {};
    },
    canMoveNext: (canMoveNext: boolean) => {
      if (!wizardStore) {
        console.warn('Store not initialized');
        return;
      }
      const currentStep = wizardStore.getStepById(stepId);
      if (currentStep) {
        currentStep.setCanMoveNext(canMoveNext);
      }
    },
  };
};

export interface NavigationConfig {
  isPreviousHidden: boolean;
  isNextDisabled: boolean;
  nextLabel: string;
  previousLabel: string;
  currentStepPosition: number;
  totalSteps: number;
  onNext: () => Promise<void>;
  onPrevious: () => Promise<void>;
}

export function useNavigationContext(): NavigationConfig {
  // Subscribe to changes in the wizardStore
  const subscribe = (callback: () => void) => {
    if (!wizardStore) return () => {};
    const store = wizardStore;
    const disposer = autorun(() => {
      // Only track the essential values that can't be derived
      store.currentStepPosition;
      store.totalSteps;
      const currentStep = store.getCurrentStep();
      currentStep?.canMoveNext;
      currentStep?.nextLabel;
      currentStep?.previousLabel;
      callback();
    });
    return disposer;
  };

  // Memoize the navigation config
  const navigationConfig = useMemo(() => {
    if (!wizardStore) {
      return {
        isPreviousHidden: false,
        isNextDisabled: false,
        nextLabel: '',
        previousLabel: '',
        currentStepPosition: 0,
        totalSteps: 0,
        onNext: async () => {},
        onPrevious: async () => {},
      };
    }
    return wizardStore.getNavigationConfig();
  }, [
    wizardStore?.currentStepPosition,
    wizardStore?.totalSteps,
    wizardStore?.getCurrentStep()?.canMoveNext,
  ]);

  // Get the current config
  const getSnapshot = () => navigationConfig;

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * Creates a navigation config object based on the current store state
 * @returns A navigation config object
 */
export function createNavigationConfig(): NavigationConfig {
  if (!wizardStore) {
    console.warn(
      'Wizard store not initialized. Call setWizardUtilsStore first.'
    );
    return {
      isPreviousHidden: true,
      isNextDisabled: true,
      nextLabel: 'Next',
      previousLabel: 'Back',
      currentStepPosition: 0,
      totalSteps: 0,
      onNext: async () => {},
      onPrevious: async () => {},
    };
  }

  const currentStep = wizardStore.getCurrentStep();
  return {
    isPreviousHidden: wizardStore.currentStepPosition === 1,
    isNextDisabled: !wizardStore.getCanMoveNext(),
    nextLabel: currentStep?.nextLabel || 'Next',
    previousLabel: currentStep?.previousLabel || 'Back',
    currentStepPosition: wizardStore.currentStepPosition,
    totalSteps: wizardStore.totalSteps,
    onNext: async () => wizardStore?.moveNext(),
    onPrevious: async () => wizardStore?.moveBack(),
  };
}
