import React from 'react';
import {
  WizardStoreActions,
  WizardStoreViews,
  WizardStoreState,
  WizardStore,
  IndicatorPosition,
  WizardNavigationProps,
  StepData,
  Step,
  WizardProps,
  StepProps,
  NavigationContext,
  StepContext,
} from './index';

// Mock component for testing
const MockComponent: React.ComponentType<Record<string, unknown>> = () => null;

describe('Type Definitions', () => {
  describe('WizardStoreActions', () => {
    it('should define correct action methods', () => {
      const mockActions: WizardStoreActions = {
        setCurrentStep: jest.fn(),
        setStepData: jest.fn(),
        markStepComplete: jest.fn(),
        setError: jest.fn(),
        preloadStepData: jest.fn(),
      };

      expect(typeof mockActions.setCurrentStep).toBe('function');
      expect(typeof mockActions.setStepData).toBe('function');
      expect(typeof mockActions.markStepComplete).toBe('function');
      expect(typeof mockActions.setError).toBe('function');
      expect(typeof mockActions.preloadStepData).toBe('function');
    });

    it('should have correct method signatures', () => {
      const mockActions: WizardStoreActions = {
        setCurrentStep: (stepId: string) => {},
        setStepData: (stepId: string, data: Record<string, unknown>) => {},
        markStepComplete: (stepId: string) => {},
        setError: (error: string | undefined) => {},
        preloadStepData: async (stepId: string) => {},
      };

      // Test that the functions can be called with correct parameters
      mockActions.setCurrentStep('step1');
      mockActions.setStepData('step1', { name: 'test' });
      mockActions.markStepComplete('step1');
      mockActions.setError('error message');
      mockActions.setError(undefined);
      mockActions.preloadStepData('step1');

      expect(mockActions).toBeDefined();
    });
  });

  describe('WizardStoreViews', () => {
    it('should define correct view methods', () => {
      const mockViews: WizardStoreViews = {
        isStepComplete: jest.fn(() => true),
        canMoveNext: jest.fn(() => true),
        canMoveBack: jest.fn(() => true),
      };

      expect(typeof mockViews.isStepComplete).toBe('function');
      expect(typeof mockViews.canMoveNext).toBe('function');
      expect(typeof mockViews.canMoveBack).toBe('function');
    });

    it('should have correct return types', () => {
      const mockViews: WizardStoreViews = {
        isStepComplete: (stepId: string): boolean => true,
        canMoveNext: (): boolean => false,
        canMoveBack: (): boolean => true,
      };

      const isComplete = mockViews.isStepComplete('step1');
      const canNext = mockViews.canMoveNext();
      const canBack = mockViews.canMoveBack();

      expect(typeof isComplete).toBe('boolean');
      expect(typeof canNext).toBe('boolean');
      expect(typeof canBack).toBe('boolean');
    });
  });

  describe('WizardStoreState', () => {
    it('should define correct state properties', () => {
      const mockState: WizardStoreState = {
        currentStepId: 'step1',
        stepData: { step1: { name: 'test' } },
        completedSteps: new Set(['step1']),
        error: 'error message',
        isLoading: false,
      };

      expect(typeof mockState.currentStepId).toBe('string');
      expect(typeof mockState.stepData).toBe('object');
      expect(mockState.completedSteps instanceof Set).toBe(true);
      expect(typeof mockState.error).toBe('string');
      expect(typeof mockState.isLoading).toBe('boolean');
    });

    it('should allow optional error property', () => {
      const mockStateWithoutError: WizardStoreState = {
        currentStepId: 'step1',
        stepData: {},
        completedSteps: new Set(),
        isLoading: false,
      };

      expect(mockStateWithoutError.error).toBeUndefined();
    });
  });

  describe('WizardStore', () => {
    it('should combine all store interfaces', () => {
      const mockStore: WizardStore = {
        // State
        currentStepId: 'step1',
        stepData: {},
        completedSteps: new Set(),
        isLoading: false,
        // Actions
        setCurrentStep: jest.fn(),
        setStepData: jest.fn(),
        markStepComplete: jest.fn(),
        setError: jest.fn(),
        preloadStepData: jest.fn(),
        // Views
        isStepComplete: jest.fn(() => true),
        canMoveNext: jest.fn(() => true),
        canMoveBack: jest.fn(() => true),
      };

      expect(mockStore).toBeDefined();
      expect(typeof mockStore.currentStepId).toBe('string');
      expect(typeof mockStore.setCurrentStep).toBe('function');
      expect(typeof mockStore.isStepComplete).toBe('function');
    });
  });

  describe('IndicatorPosition', () => {
    it('should define correct position values', () => {
      const positions: IndicatorPosition[] = ['above', 'between', 'below'];
      
      positions.forEach(position => {
        expect(['above', 'between', 'below']).toContain(position);
      });
    });

    it('should be assignable to variables', () => {
      const above: IndicatorPosition = 'above';
      const between: IndicatorPosition = 'between';
      const below: IndicatorPosition = 'below';

      expect(above).toBe('above');
      expect(between).toBe('between');
      expect(below).toBe('below');
    });
  });

  describe('WizardNavigationProps', () => {
    it('should define optional properties', () => {
      const minimalProps: WizardNavigationProps = {};
      expect(minimalProps).toBeDefined();

      const fullProps: WizardNavigationProps = {
        ButtonComponent: MockComponent,
        StepIndicatorComponent: MockComponent,
        indicatorPosition: 'above',
      };
      expect(fullProps).toBeDefined();
    });

    it('should have correct ButtonComponent signature', () => {
      const ButtonComponent: React.ComponentType<{
        onPress: () => void;
        title: string;
        disabled?: boolean;
      }> = ({ onPress, title, disabled }) => null;

      const props: WizardNavigationProps = {
        ButtonComponent,
      };

      expect(props.ButtonComponent).toBeDefined();
    });
  });

  describe('StepData', () => {
    it('should allow any key-value pairs', () => {
      const stepData: StepData = {
        name: 'John',
        age: 30,
        isActive: true,
        metadata: { created: new Date() },
        items: [1, 2, 3],
      };

      expect(stepData.name).toBe('John');
      expect(stepData.age).toBe(30);
      expect(stepData.isActive).toBe(true);
      expect(stepData.metadata).toBeDefined();
      expect(Array.isArray(stepData.items)).toBe(true);
    });

    it('should allow empty object', () => {
      const emptyStepData: StepData = {};
      expect(Object.keys(emptyStepData)).toHaveLength(0);
    });
  });

  describe('Step', () => {
    it('should define required properties', () => {
      const step: Step = {
        id: 'step1',
        order: 1,
        component: MockComponent,
      };

      expect(step.id).toBe('step1');
      expect(step.order).toBe(1);
      expect(step.component).toBe(MockComponent);
    });

    it('should allow optional properties', () => {
      const stepWithOptionals: Step = {
        id: 'step1',
        order: 1,
        component: MockComponent,
        canMoveNext: true,
        nextLabel: 'Continue',
        previousLabel: 'Go Back',
      };

      expect(stepWithOptionals.canMoveNext).toBe(true);
      expect(stepWithOptionals.nextLabel).toBe('Continue');
      expect(stepWithOptionals.previousLabel).toBe('Go Back');
    });
  });

  describe('WizardProps', () => {
    it('should define required steps property', () => {
      const minimalProps: WizardProps = {
        steps: [{
          id: 'step1',
          order: 1,
          component: MockComponent,
        }],
      };

      expect(Array.isArray(minimalProps.steps)).toBe(true);
      expect(minimalProps.steps).toHaveLength(1);
    });

    it('should allow optional properties', () => {
      const fullProps: WizardProps = {
        steps: [{
          id: 'step1',
          order: 1,
          component: MockComponent,
        }],
        nextLabel: 'Next',
        previousLabel: 'Previous',
        finishLabel: 'Finish',
        renderLoading: () => null,
        renderNavigation: MockComponent,
      };

      expect(fullProps.nextLabel).toBe('Next');
      expect(fullProps.previousLabel).toBe('Previous');
      expect(fullProps.finishLabel).toBe('Finish');
      expect(typeof fullProps.renderLoading).toBe('function');
      expect(fullProps.renderNavigation).toBe(MockComponent);
    });
  });

  describe('StepProps', () => {
    it('should define all required properties', () => {
      const stepProps: StepProps = {
        index: 0,
        isCompleted: true,
        isCurrent: false,
        stepId: 'step1',
      };

      expect(typeof stepProps.index).toBe('number');
      expect(typeof stepProps.isCompleted).toBe('boolean');
      expect(typeof stepProps.isCurrent).toBe('boolean');
      expect(typeof stepProps.stepId).toBe('string');
    });
  });

  describe('NavigationContext', () => {
    it('should define all required properties', () => {
      const navContext: NavigationContext = {
        isPreviousHidden: false,
        isNextDisabled: true,
        nextLabel: 'Next',
        previousLabel: 'Previous',
        currentStepPosition: 1,
        totalSteps: 3,
        onNext: async () => {},
        onPrevious: async () => {},
      };

      expect(typeof navContext.isPreviousHidden).toBe('boolean');
      expect(typeof navContext.isNextDisabled).toBe('boolean');
      expect(typeof navContext.nextLabel).toBe('string');
      expect(typeof navContext.previousLabel).toBe('string');
      expect(typeof navContext.currentStepPosition).toBe('number');
      expect(typeof navContext.totalSteps).toBe('number');
      expect(typeof navContext.onNext).toBe('function');
      expect(typeof navContext.onPrevious).toBe('function');
    });

    it('should have async navigation functions', async () => {
      const navContext: NavigationContext = {
        isPreviousHidden: false,
        isNextDisabled: false,
        nextLabel: 'Next',
        previousLabel: 'Previous',
        currentStepPosition: 1,
        totalSteps: 3,
        onNext: async () => Promise.resolve(),
        onPrevious: async () => Promise.resolve(),
      };

      await expect(navContext.onNext()).resolves.toBeUndefined();
      await expect(navContext.onPrevious()).resolves.toBeUndefined();
    });
  });

  describe('StepContext', () => {
    it('should define all required properties', () => {
      const stepContext: StepContext = {
        stepId: 'step1',
        updateField: (field: string, value: unknown) => {},
        getStepData: () => ({ name: 'test' }),
        canMoveNext: (canMove: boolean) => {},
      };

      expect(typeof stepContext.stepId).toBe('string');
      expect(typeof stepContext.updateField).toBe('function');
      expect(typeof stepContext.getStepData).toBe('function');
      expect(typeof stepContext.canMoveNext).toBe('function');
    });

    it('should have correct function signatures', () => {
      const stepContext: StepContext = {
        stepId: 'step1',
        updateField: (field: string, value: unknown) => {},
        getStepData: (): StepData => ({ name: 'test' }),
        canMoveNext: (canMove: boolean) => {},
      };

      stepContext.updateField('name', 'John');
      const data = stepContext.getStepData();
      stepContext.canMoveNext(true);

      expect(data).toEqual({ name: 'test' });
    });
  });

  describe('Type Compatibility', () => {
    it('should allow proper type composition', () => {
      // Test that types can be used together properly
      const step: Step = {
        id: 'test-step',
        order: 1,
        component: MockComponent,
        canMoveNext: true,
      };

      const wizardProps: WizardProps = {
        steps: [step],
        nextLabel: 'Continue',
      };

      const stepData: StepData = {
        field1: 'value1',
        field2: 42,
      };

      expect(wizardProps.steps).toContain(step);
      expect(stepData.field1).toBe('value1');
    });

    it('should work with React component types', () => {
      const TestComponent: React.ComponentType<Record<string, unknown>> = (props) => null;
      
      const step: Step = {
        id: 'test',
        order: 1,
        component: TestComponent,
      };

      const navProps: WizardNavigationProps = {
        ButtonComponent: TestComponent,
        StepIndicatorComponent: TestComponent,
      };

      expect(step.component).toBe(TestComponent);
      expect(navProps.ButtonComponent).toBe(TestComponent);
    });
  });
});
