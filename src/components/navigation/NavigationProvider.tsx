import React, { createContext, useContext } from 'react';
import { WizardStoreType } from '../../stores/WizardStore';

type NavigationContextType = {
  store: WizardStoreType;
  onNext: () => void;
  onBack: () => void;
};

const NavigationContext = createContext<NavigationContextType | null>(null);

export const NavigationProvider: React.FC<{
  store: WizardStoreType;
  onNext: () => void;
  onBack: () => void;
  children: React.ReactNode;
}> = ({ 
  store, 
  onNext, 
  onBack, 
  children 
}) => {
  const value = {
    store,
    onNext,
    onBack
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}; 