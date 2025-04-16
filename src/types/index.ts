import React, { ReactNode } from 'react';
import { ButtonProps } from 'react-native';
import { IWizardStore } from '../stores/WizardStore';

export type Step = {
  id: string;
  order: number;
  component: React.ComponentType<any>;
  canMoveNext?: boolean;
  nextLabel?: string;
  previousLabel?: string;
};

export interface AnimationConfig {
  duration?: number;
  type?: 'slide' | 'fade' | 'none';
}

export type IndicatorPosition = 'above' | 'between' | 'below';

export type WizardProps<T = any> = {
  steps: Step[];
  nextLabel?: string;
  previousLabel?: string;
  finishLabel?: string;
  renderLoading?: () => React.ReactNode;
  renderNavigation?: ((store: IWizardStore) => React.ReactNode) | undefined;
  animationConfig?: AnimationConfig;
};

export interface StepProps {
  index: number;
  isCompleted: boolean;
  isCurrent: boolean;
  stepId: string;
}

export interface ConnectorProps {
  index: number;
  isActive: boolean;
  isCompleted: boolean;
}

export interface StepIndicatorProps {
  index: number;
  isCompleted: boolean;
  isCurrent: boolean;
  stepId: string;
  store: IWizardStore;
  renderStep?: ((props: StepProps) => React.ReactNode) | undefined;
  renderConnector?: ((props: ConnectorProps) => React.ReactNode) | undefined;
}

export interface DefaultTransitionProps {
  children: ReactNode;
  animationConfig?: AnimationConfig;
  direction: 'forward' | 'backward';
}

export type StepperNavigationProps = {
  store: IWizardStore;
  renderStep?:
    | ((props: {
        index: number;
        isCompleted: boolean;
        isCurrent: boolean;
        stepId: string;
      }) => React.ReactNode)
    | undefined;
  renderConnector?:
    | ((props: {
        index: number;
        isActive: boolean;
        isCompleted: boolean;
      }) => React.ReactNode)
    | undefined;
};

export type NavigationContextType = {
  store: IWizardStore;
};
