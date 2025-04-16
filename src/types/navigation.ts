import { ReactNode } from 'react';
import { ButtonProps } from 'react-native';
import { WizardStoreType } from './common';

export interface StepProps {
  index: number;
  isCompleted: boolean;
  isCurrent: boolean;
  stepId: string;
}

export interface ConnectorProps {
  index: number;
  isCompleted: boolean;
}

export interface StepIndicatorProps {
  store: WizardStoreType;
  renderStep?: ((props: StepProps) => ReactNode) | undefined;
  renderConnector?: ((props: ConnectorProps) => ReactNode) | undefined;
}

export interface NavigationProps {
  store: WizardStoreType;
  onNext: () => void;
  onBack: () => void;
  renderNextButton?: ((props: ButtonProps) => ReactNode) | undefined;
  renderBackButton?: ((props: ButtonProps) => ReactNode) | undefined;
}
