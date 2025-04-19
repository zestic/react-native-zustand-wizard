import { types, Instance, SnapshotIn } from 'mobx-state-tree';
import { setWizardUtilsStore } from '../utils/wizardUtils';

// Define the Step Model
const StepModel = types
  .model('Step', {
    id: types.identifier,
    order: types.number,
    canMoveNext: types.boolean,
    nextLabel: types.optional(types.string, ''),
    previousLabel: types.optional(types.string, ''),
  })
  .actions((self) => ({
    setCanMoveNext(value: boolean) {
      self.canMoveNext = value;
    },
  }));

// Define StepModel Instance type
type StepModelType = Instance<typeof StepModel>;

// Define StepData type
type StepData = Record<string, unknown>;

const WizardStoreBase = types
  .model('WizardStore', {
    currentStepId: types.optional(types.string, ''),
    currentStepPosition: types.optional(types.number, 0),
    isLoading: types.optional(types.boolean, false),
    error: types.optional(types.string, ''),
    stepData: types.optional(types.map(types.frozen()), {}),
    steps: types.array(StepModel),
    totalSteps: types.optional(types.number, 0),
  })
  .preProcessSnapshot((snapshot) => {
    const steps = (snapshot.steps || []) as SnapshotIn<typeof StepModel>[];
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

    const processedSnapshot = { ...snapshot };

    if (
      processedSnapshot.currentStepId &&
      !processedSnapshot.currentStepPosition
    ) {
      const step = steps.find((s) => s.id === processedSnapshot.currentStepId);
      if (step) {
        processedSnapshot.currentStepPosition = step.order;
      } else {
        processedSnapshot.currentStepId = sortedSteps[0]?.id || '';
        processedSnapshot.currentStepPosition = sortedSteps[0]?.order || 0;
      }
    } else if (!processedSnapshot.currentStepId && steps.length > 0) {
      processedSnapshot.currentStepId = sortedSteps[0]?.id || '';
      processedSnapshot.currentStepPosition = sortedSteps[0]?.order || 0;
    }
    processedSnapshot.totalSteps = steps.length;

    return processedSnapshot;
  })
  .views((self) => {
    // Helper view to get the current step instance
    const getCurrentStep = (): StepModelType | undefined => {
      // Cast self once here if needed, though MST often infers correctly within .views
      const store = self as WizardStoreType;
      return store.steps.find(
        (s: StepModelType) => s.order === store.currentStepPosition
      );
    };

    return {
      // Expose getCurrentStep as a public view
      getCurrentStep,

      getStepById(id: string): StepModelType | undefined {
        const store = self as WizardStoreType;
        return store.steps.find((s: StepModelType) => s.id === id);
      },
      getStepData(stepId: string): StepData {
        const store = self as WizardStoreType;
        return (store.stepData.get(stepId) || {}) as StepData;
      },
      getWizardData(): Record<string, StepData> {
        const store = self as WizardStoreType;
        const wizardData: Record<string, StepData> = {};
        store.steps.forEach((step: StepModelType) => {
          const stepData = store.stepData.get(step.id);
          if (stepData) {
            wizardData[step.id] = stepData as StepData;
          }
        });
        return wizardData;
      },
      get isFirstStep(): boolean {
        const store = self as WizardStoreType;
        return store.currentStepPosition === 1;
      },
      get isLastStep(): boolean {
        const store = self as WizardStoreType;
        return store.currentStepPosition === store.totalSteps;
      },
      getCanMoveBack(): boolean {
        const store = self as WizardStoreType;
        return store.currentStepPosition > 1;
      },
      get canMoveNext(): boolean {
        const store = self as WizardStoreType;
        const currentStep = store.getCurrentStep();
        return currentStep ? currentStep.canMoveNext : false;
      },
      getNextStep(): StepModelType | undefined {
        const store = self as WizardStoreType;
        const currentStep = store.getCurrentStep();
        if (!currentStep) return undefined;
        return store.steps
          .slice()
          .filter((s: StepModelType) => s.order > currentStep.order)
          .sort((a: StepModelType, b: StepModelType) => a.order - b.order)[0];
      },
      getPreviousStep(): StepModelType | undefined {
        const store = self as WizardStoreType;
        const currentStep = store.getCurrentStep();
        if (!currentStep) return undefined;
        return store.steps
          .slice()
          .filter((s: StepModelType) => s.order < currentStep.order)
          .sort((a: StepModelType, b: StepModelType) => b.order - a.order)[0];
      },
      get nextButtonLabel(): string {
        const store = self as WizardStoreType;
        const currentStep = store.getCurrentStep();
        return currentStep?.nextLabel || 'Next';
      },
      get previousButtonLabel(): string {
        const store = self as WizardStoreType;
        const currentStep = store.getCurrentStep();
        return currentStep?.previousLabel || 'Previous';
      },
    };
  })
  .actions((self) => {
    return {
      setLoading(isLoading: boolean): void {
        self.isLoading = isLoading;
      },
      setError(error: string | null): void {
        self.error = error || '';
      },
      setCurrentStep: async (stepId: string): Promise<void> => {
        const step = self.steps.find((s: StepModelType) => s.id === stepId);
        if (!step) {
          console.error(`Step with id ${stepId} not found`);
          return;
        }
        self.currentStepId = stepId;
        self.currentStepPosition = step.order;
      },
      moveNext: async (): Promise<void> => {
        const nextStep = self.getNextStep();
        if (nextStep) {
          const step = self.steps.find(
            (s: StepModelType) => s.id === nextStep.id
          );
          if (step) {
            self.currentStepId = step.id;
            self.currentStepPosition = step.order;
          }
        }
      },
      moveBack: async (): Promise<void> => {
        const previousStep = self.getPreviousStep();
        if (previousStep) {
          const step = self.steps.find(
            (s: StepModelType) => s.id === previousStep.id
          );
          if (step) {
            self.currentStepId = step.id;
            self.currentStepPosition = step.order;
          }
        }
      },
      setStepData: async (stepId: string, data: StepData): Promise<void> => {
        const step = self.steps.find((s: StepModelType) => s.id === stepId);
        if (!step) {
          console.error(`Step with id ${stepId} not found`);
          return;
        }
        self.stepData.set(stepId, data);
      },
      updateField: async (
        stepId: string,
        field: string,
        value: unknown
      ): Promise<void> => {
        const existingData = (self.stepData.get(stepId) || {}) as StepData;
        const newData = { ...existingData, [field]: value };
        self.stepData.set(stepId, newData);
      },
      reset: async (): Promise<void> => {
        const firstStep = self.steps
          .slice()
          .sort((a: StepModelType, b: StepModelType) => a.order - b.order)[0];
        if (firstStep) {
          self.currentStepId = firstStep.id;
          self.currentStepPosition = firstStep.order;
        } else {
          self.currentStepId = '';
          self.currentStepPosition = 0;
        }
        self.stepData.clear();
        self.isLoading = false;
        self.error = '';
      },
      afterCreate() {
        setWizardUtilsStore(self as IWizardStore);
      },
    };
  });

export const WizardStore = WizardStoreBase;
export type WizardStoreType = Instance<typeof WizardStore>;
export type WizardStoreSnapshotIn = SnapshotIn<typeof WizardStore>;

export interface IWizardStore extends Instance<typeof WizardStore> {
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentStep: (stepId: string) => Promise<void>;
  moveNext: () => Promise<void>;
  moveBack: () => Promise<void>;
  setStepData: (stepId: string, data: StepData) => Promise<void>;
  updateField: (stepId: string, field: string, value: unknown) => Promise<void>;
  reset: () => Promise<void>;
  afterCreate: () => void;
}
