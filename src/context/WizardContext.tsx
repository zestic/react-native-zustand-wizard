import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useWizardStore, WizardStore, Step } from '../stores/WizardStore.zustand';

interface WizardContextType {
  store: WizardStore;
}

const WizardContext = createContext<WizardContextType | null>(null);

interface WizardProviderProps {
  children: ReactNode;
  steps: Omit<Step, 'nextLabel' | 'previousLabel'>[];
  nextLabel?: string;
  previousLabel?: string;
  finishLabel?: string;
}

export const WizardProvider: React.FC<WizardProviderProps> = ({
  children,
  steps,
  nextLabel = 'Next',
  previousLabel = 'Previous',
  finishLabel = 'Finish',
}) => {
  const store = useWizardStore();

  // Initialize the store when steps change
  useEffect(() => {
    if (steps && steps.length > 0) {
      store.initializeSteps(steps, nextLabel, previousLabel, finishLabel);
    }
  }, [steps, nextLabel, previousLabel, finishLabel]); // Remove store from dependencies

  const contextValue: WizardContextType = {
    store,
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
