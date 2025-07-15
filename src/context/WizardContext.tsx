import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useWizardStore, WizardStore, Step } from '../stores/WizardStore';
import type { StepData } from '../types';

interface WizardContextType {
  store: WizardStore;
  onComplete?: (data: Record<string, StepData>) => void;
}

const WizardContext = createContext<WizardContextType | null>(null);

interface WizardProviderProps {
  children: ReactNode;
  steps: Step[];
  nextLabel?: string;
  previousLabel?: string;
  finishLabel?: string;
  onComplete?: (data: Record<string, StepData>) => void;
}

export const WizardProvider: React.FC<WizardProviderProps> = ({
  children,
  steps,
  nextLabel = 'Next',
  previousLabel = 'Previous',
  finishLabel = 'Finish',
  onComplete,
}) => {
  const store = useWizardStore();

  // Initialize the store when steps change
  useEffect(() => {
    if (steps && steps.length > 0) {
      store.initializeSteps(steps, nextLabel, previousLabel, finishLabel);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps, nextLabel, previousLabel, finishLabel]); // Intentionally exclude store to prevent infinite loop

  // Set the onComplete callback when it changes
  useEffect(() => {
    store.setOnComplete(onComplete);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onComplete]); // Intentionally exclude store to prevent infinite loop

  const contextValue: WizardContextType = {
    store,
    ...(onComplete && { onComplete }),
  };

  return (
    <WizardContext.Provider value={contextValue}>
      {children}
    </WizardContext.Provider>
  );
};

export const useWizardContext = (): WizardContextType => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizardContext must be used within a WizardProvider');
  }
  return context;
};

// Hook to get the store directly (for convenience)
export const useWizard = (): WizardStore => {
  const { store } = useWizardContext();
  return store;
};
