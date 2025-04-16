import { Instance } from 'mobx-state-tree';
import { WizardStore } from '../stores/WizardStore';

export type WizardStoreType = Instance<typeof WizardStore>;

export interface StepData {
  [key: string]: unknown;
}

export interface ValidationResult {
  isValid: boolean;
  errors?: Record<string, string>;
}

export interface StepValidation {
  validate: (data: StepData) => ValidationResult | Promise<ValidationResult>;
}

export type StepComponentProps = {
  store: WizardStoreType;
};

export type NavigationComponentProps = {
  store: WizardStoreType;
  onNext?: () => void;
  onPrevious?: () => void;
};
