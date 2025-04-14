import React from 'react';
import { Instance } from 'mobx-state-tree';
import { WizardStore } from './stores/WizardStore';

export type WizardStoreType = Instance<typeof WizardStore>;

export interface StepConfig {
  id: string;
  component: React.ComponentType<{ store: WizardStoreType }>;
  order: number;
  nextLabel?: string;
  previousLabel?: string;
  canMoveNext?: boolean;
}

export interface WizardProps {
  steps: StepConfig[];
  nextLabel?: string;
  previousLabel?: string;
  finishLabel?: string;
  renderStep?: (props: { currentStep: StepConfig; store: WizardStoreType }) => React.ReactNode;
  renderNextButton?: (props: any) => React.ReactNode;
  renderBackButton?: (props: any) => React.ReactNode;
  renderLoading?: () => React.ReactNode;
  renderNavigation?: (props: any) => React.ReactNode;
}
