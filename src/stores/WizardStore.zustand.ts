import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Types for the Zustand store
export interface Step {
  id: string;
  order: number;
  canMoveNext: boolean;
  nextLabel: string;
  previousLabel: string;
}

export type StepData = Record<string, unknown>;

export interface WizardState {
  // Core state properties (equivalent to MST model properties)
  currentStepId: string;
  currentStepPosition: number;
  isLoading: boolean;
  error: string;
  stepData: Map<string, StepData>;
  steps: Step[];
  totalSteps: number;
}

export interface WizardActions {
  // Actions (equivalent to MST actions)
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentStep: (stepId: string) => Promise<void>;
  moveNext: () => Promise<void>;
  moveBack: () => Promise<void>;
  setStepData: (stepId: string, data: StepData) => Promise<void>;
  updateField: (stepId: string, field: string, value: unknown) => Promise<void>;
  reset: () => Promise<void>;
  initializeSteps: (steps: Omit<Step, 'nextLabel' | 'previousLabel'>[], defaultNextLabel?: string, defaultPreviousLabel?: string, finishLabel?: string) => void;
}

export interface WizardSelectors {
  // Computed values (equivalent to MST views)
  getCurrentStep: () => Step | undefined;
  getStepById: (id: string) => Step | undefined;
  getStepData: (stepId: string) => StepData;
  getWizardData: () => Record<string, StepData>;
  getNextStep: () => Step | undefined;
  getPreviousStep: () => Step | undefined;
  // These will be computed properties that update with state
  canMoveNext: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  nextButtonLabel: string;
  previousButtonLabel: string;
}

export type WizardStore = WizardState & WizardActions & WizardSelectors;

// Helper function to validate step ordering
const validateSteps = (steps: Step[]): void => {
  if (steps.length === 0) {
    throw new Error('Wizard must have at least one step');
  }

  const sortedSteps = [...steps].sort((a, b) => a.order - b.order);
  
  for (let i = 0; i < sortedSteps.length; i++) {
    const step = sortedSteps[i];
    if (!step || step.order !== i + 1) {
      throw new Error(
        `Step orders must be sequential starting from 1. Found order ${step?.order} at index ${i}`
      );
    }
  }
};

// Helper function to compute derived state
const computeDerivedState = (state: WizardState) => {
  const currentStep = state.steps.find((s) => s.order === state.currentStepPosition);
  return {
    canMoveNext: currentStep ? currentStep.canMoveNext : false,
    isFirstStep: state.currentStepPosition === 1,
    isLastStep: state.currentStepPosition === state.totalSteps,
    nextButtonLabel: currentStep?.nextLabel || 'Next',
    previousButtonLabel: currentStep?.previousLabel || 'Previous',
  };
};

// Create the Zustand store
export const useWizardStore = create<WizardStore>()(
  devtools(
    (set, get) => {
      const updateStateWithDerived = (newState: Partial<WizardState>) => {
        const currentState = get();
        const updatedState = { ...currentState, ...newState };
        const derived = computeDerivedState(updatedState);
        return { ...updatedState, ...derived };
      };

      return {
        // Initial state
        currentStepId: '',
        currentStepPosition: 0,
        isLoading: false,
        error: '',
        stepData: new Map<string, StepData>(),
        steps: [],
        totalSteps: 0,
        // Initial derived state
        canMoveNext: false,
        isFirstStep: false,
        isLastStep: false,
        nextButtonLabel: 'Next',
        previousButtonLabel: 'Previous',

        // Actions
        setLoading: (isLoading: boolean) => {
          set(updateStateWithDerived({ isLoading }), false, 'setLoading');
        },

        setError: (error: string | null) => {
          set(updateStateWithDerived({ error: error || '' }), false, 'setError');
        },

        setCurrentStep: async (stepId: string) => {
          const state = get();
          const step = state.steps.find((s) => s.id === stepId);
          if (!step) {
            console.error(`Step with id ${stepId} not found`);
            return;
          }
          set(
            updateStateWithDerived({
              currentStepId: stepId,
              currentStepPosition: step.order,
            }),
            false,
            'setCurrentStep'
          );
        },

        moveNext: async () => {
          const state = get();
          const nextStep = state.getNextStep();
          if (nextStep) {
            set(
              updateStateWithDerived({
                currentStepId: nextStep.id,
                currentStepPosition: nextStep.order,
              }),
              false,
              'moveNext'
            );
          }
        },

        moveBack: async () => {
          const state = get();
          const previousStep = state.getPreviousStep();
          if (previousStep) {
            set(
              updateStateWithDerived({
                currentStepId: previousStep.id,
                currentStepPosition: previousStep.order,
              }),
              false,
              'moveBack'
            );
          }
        },

        setStepData: async (stepId: string, data: StepData) => {
          const state = get();
          const step = state.steps.find((s) => s.id === stepId);
          if (!step) {
            console.error(`Step with id ${stepId} not found`);
            return;
          }
          const newStepData = new Map(state.stepData);
          newStepData.set(stepId, data);
          set(updateStateWithDerived({ stepData: newStepData }), false, 'setStepData');
        },

        updateField: async (stepId: string, field: string, value: unknown) => {
          const state = get();
          const existingData = state.stepData.get(stepId) || {};
          const newData = { ...existingData, [field]: value };
          const newStepData = new Map(state.stepData);
          newStepData.set(stepId, newData);
          set(updateStateWithDerived({ stepData: newStepData }), false, 'updateField');
        },

        reset: async () => {
          const state = get();
          const firstStep = [...state.steps]
            .sort((a, b) => a.order - b.order)[0];

          if (firstStep) {
            set(
              updateStateWithDerived({
                currentStepId: firstStep.id,
                currentStepPosition: firstStep.order,
                stepData: new Map<string, StepData>(),
                isLoading: false,
                error: '',
              }),
              false,
              'reset'
            );
          } else {
            set(
              updateStateWithDerived({
                currentStepId: '',
                currentStepPosition: 0,
                stepData: new Map<string, StepData>(),
                isLoading: false,
                error: '',
              }),
              false,
              'reset'
            );
          }
        },

        initializeSteps: (
          steps: Omit<Step, 'nextLabel' | 'previousLabel'>[],
          defaultNextLabel = 'Next',
          defaultPreviousLabel = 'Previous',
          finishLabel = 'Finish'
        ) => {
          const lastStepOrder = Math.max(...steps.map((s) => s.order), 0);

          const processedSteps: Step[] = steps.map((step) => {
            const isLast = step.order === lastStepOrder;
            return {
              ...step,
              nextLabel: isLast ? finishLabel : defaultNextLabel,
              previousLabel: defaultPreviousLabel,
            };
          });

          validateSteps(processedSteps);

          const sortedSteps = [...processedSteps].sort((a, b) => a.order - b.order);
          const firstStep = sortedSteps[0];

          set(
            updateStateWithDerived({
              steps: processedSteps,
              totalSteps: processedSteps.length,
              currentStepId: firstStep?.id || '',
              currentStepPosition: firstStep?.order || 0,
            }),
            false,
            'initializeSteps'
          );
        },

        // Selectors (computed values)
        getCurrentStep: () => {
          const state = get();
          return state.steps.find((s) => s.order === state.currentStepPosition);
        },

        getStepById: (id: string) => {
          const state = get();
          return state.steps.find((s) => s.id === id);
        },

        getStepData: (stepId: string) => {
          const state = get();
          return state.stepData.get(stepId) || {};
        },

        getWizardData: () => {
          const state = get();
          const wizardData: Record<string, StepData> = {};
          state.steps.forEach((step) => {
            const stepData = state.stepData.get(step.id);
            if (stepData) {
              wizardData[step.id] = stepData;
            }
          });
          return wizardData;
        },

        getNextStep: () => {
          const state = get();
          const currentStep = state.getCurrentStep();
          if (!currentStep) return undefined;
          return state.steps
            .filter((s) => s.order > currentStep.order)
            .sort((a, b) => a.order - b.order)[0];
        },

        getPreviousStep: () => {
          const state = get();
          const currentStep = state.getCurrentStep();
          if (!currentStep) return undefined;
          return state.steps
            .filter((s) => s.order < currentStep.order)
            .sort((a, b) => b.order - a.order)[0];
        },
      };
    },
    {
      name: 'wizard-store',
    }
  )
);

// Export types for external use
export type { WizardStore as WizardStoreType };
