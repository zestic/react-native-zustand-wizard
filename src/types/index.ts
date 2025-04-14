import { WizardStore } from '../stores/WizardStore';
import { Instance } from 'mobx-state-tree';
import React, { ReactNode } from 'react';
import { NavigationProps } from '../components/navigation/NavigationButtons';
import { ButtonProps } from 'react-native';

// Assuming StepProps and ConnectorProps might be defined simply for now if needed
type StepProps = { [key: string]: any }; 
type ConnectorProps = { [key: string]: any };

export type WizardStoreType = Instance<typeof WizardStore>;

export type StepConfig<T = any> = {
  id: string;
  component: React.ComponentType<any>;
  order: number;
  canMoveNext?: boolean;
  nextLabel?: string | ((data: T) => string);
  previousLabel?: string | ((data: T) => string);
};

export interface AnimationConfig {
  duration?: number;
  type?: 'slide' | 'fade' | 'none';
}

export type WizardProps<T = any> = {
  steps: StepConfig<T>[];
  nextLabel?: string;
  previousLabel?: string;
  finishLabel?: string;
  renderStep?: ((props: StepProps) => React.ReactNode) | undefined;
  renderNextButton?: ((props: ButtonProps) => React.ReactNode) | null;
  renderBackButton?: ((props: ButtonProps) => React.ReactNode) | null;
  renderLoading?: () => React.ReactNode;
  renderNavigation?: ((props: NavigationProps) => React.ReactNode) | undefined;
  animationConfig?: AnimationConfig;
};

export interface StepIndicatorProps {
  index: number;
  isCompleted: boolean;
  isCurrent: boolean;
  stepId: string;
  store: WizardStoreType;
  renderStep?: ((props: StepProps) => React.ReactNode) | undefined;
  renderConnector?: ((props: ConnectorProps) => React.ReactNode) | undefined;
}

export interface DefaultTransitionProps {
  children: ReactNode;
  animationConfig?: AnimationConfig;
  direction: 'forward' | 'backward';
}

export type StepperNavigationProps = {
  store: WizardStoreType;
  renderStep?: ((props: { index: number; isCompleted: boolean; isCurrent: boolean; stepId: string }) => React.ReactNode) | undefined;
  renderConnector?: ((props: { index: number; isActive: boolean; isCompleted: boolean }) => React.ReactNode) | undefined;
};

export type NavigationContextType = {
  store: WizardStoreType;
};
