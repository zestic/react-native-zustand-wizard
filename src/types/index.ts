import React from 'react';

// Store action types
export interface WizardStoreActions {
  setCurrentStep: (stepId: string) => void;
  setStepData: (stepId: string, data: Record<string, unknown>) => void;
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

// Store state types
export interface WizardStoreState {
  currentStepId: string;
  stepData: Record<string, Record<string, unknown>>;
  completedSteps: Set<string>;
  error?: string;
  isLoading: boolean;
}

// Combined store type
export type WizardStore = WizardStoreState &
  WizardStoreActions &
  WizardStoreViews;

export type IndicatorPosition = 'above' | 'between' | 'below';

export interface WizardNavigationProps {
  ButtonComponent?: React.ComponentType<{
    onPress: () => void;
    title: string;
    disabled?: boolean;
  }>;
  StepIndicatorComponent?: React.ComponentType;
  indicatorPosition?: IndicatorPosition;
}

export interface StepData {
  [key: string]: unknown;
}
export type Step = {
  id: string;
  order: number;
  component: React.ComponentType<Record<string, unknown>>;
  canMoveNext?: boolean;
  nextLabel?: string;
  previousLabel?: string;
};

export type WizardProps = {
  steps: Step[];
  nextLabel?: string;
  previousLabel?: string;
  finishLabel?: string;
  onComplete?: (data: Record<string, StepData>) => void;
  renderLoading?: () => React.ReactNode;
  renderNavigation?: React.ComponentType<WizardNavigationProps>;
};

export interface StepProps {
  index: number;
  isCompleted: boolean;
  isCurrent: boolean;
  stepId: string;
}

export interface NavigationContext {
  isPreviousHidden: boolean;
  isNextDisabled: boolean;
  nextLabel: string;
  previousLabel: string;
  currentStepPosition: number;
  totalSteps: number;
  onNext: () => Promise<void>;
  onPrevious: () => Promise<void>;
}

export interface StepContext {
  stepId: string;
  updateField: (field: string, value: unknown) => void;
  getStepData: () => StepData;
  canMoveNext: (canMoveNext: boolean) => void;
}
