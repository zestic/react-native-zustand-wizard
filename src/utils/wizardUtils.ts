import { Instance } from 'mobx-state-tree';
import { WizardStore } from '../stores/WizardStore';
import { useState, useEffect } from 'react';
import { autorun } from 'mobx';

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
export function initializeWizardStore(store: WizardStoreType) {
  if (!store) {
    console.warn('Cannot initialize with null store');
    return;
  }
  wizardStore = store;
};

/**
 * Update a field in the wizard store
 * @param stepId The ID of the step to update
 * @param field The field name to update
 * @param value The new value for the field
 */
export const updateField = (stepId: string, field: string, value: any) => {
  if (!wizardStore) {
    console.error('Wizard store not initialized. Call initializeWizardStore first.');
    return;
  }
  
  wizardStore.updateField(stepId, field, value);
};

/**
 * Custom hook that provides step context
 * @param stepId The ID of the step
 * @param store The wizard store
 * @returns A step context object with the step ID and helper functions
 */
export const useStepContext = (stepId: string, store: WizardStoreType): StepContext => {
  // Create a state to trigger re-renders when data changes
  const [, setUpdate] = useState({});
  
  // Set up an effect to update the component when the store changes
  useEffect(() => {
    if (!store) {
      console.warn('Store not initialized');
      return;
    }

    // Use autorun to track changes to the store's stepData
    const disposer = autorun(() => {
      // Access the stepData to track changes
      store.getStepData(stepId); // Access to trigger autorun
      setUpdate({});
    });
    
    return () => {
      disposer();
    };
  }, [store, stepId]);
  
  // Return the step context with safe access to store methods
  return {
    stepId,
    updateField: (field: string, value: any) => {
      if (!store) {
        console.warn('Store not initialized');
        return;
      }
      store.updateField(stepId, field, value);
    },
    getStepData: () => {
      if (!store) {
        console.warn('Store not initialized');
        return {};
      }
      return store.getStepData(stepId) || {};
    },
    canMoveNext: (canMoveNext: boolean) => {
      if (!store) {
        console.warn('Store not initialized');
        return;
      }
      // Find the current step model in the store
      const currentStep = store.getStepById(stepId); // Use view to get the step model
      if (currentStep) {
        // Call the action on the StepModel instance
        currentStep.setCanMoveNext(canMoveNext);
      }
    }
  };
}; 