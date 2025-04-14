import { Instance } from 'mobx-state-tree';
import { WizardStore } from '../stores/WizardStore';

export type WizardStoreType = Instance<typeof WizardStore>;

// Store action types
export interface WizardStoreActions {
  [key: string]: (...args: any[]) => any;
  setCurrentStep: (stepId: string) => void;
  setStepData: (stepId: string, data: any) => void;
  markStepComplete: (stepId: string) => void;
  setError: (error: string | undefined) => void;
  preloadStepData: (stepId: string) => Promise<void>;
}

// Store view types
export interface WizardStoreViews {
  isStepComplete: (stepId: string) => boolean;
  canMoveNext: () => boolean;
  canMoveBack: () => boolean;
}

// Combined store type
export type WizardStore = WizardStoreType & WizardStoreActions & WizardStoreViews; 