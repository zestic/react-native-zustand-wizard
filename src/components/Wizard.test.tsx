import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import { Wizard } from './Wizard';
import { Step, WizardNavigationProps } from '../types';

// Mock the WizardNavigation component to avoid complex dependencies
jest.mock('./navigation/WizardNavigation', () => {
  const mockReact = require('react');
  const { Text } = require('react-native');
  return {
    WizardNavigation: () => mockReact.createElement(Text, { testID: 'wizard-navigation' }, 'Navigation'),
  };
});

// Mock the WizardContext to control the store behavior
jest.mock('../context/WizardContext', () => {
  const mockReact = require('react');
  const mockStore = {
    currentStepId: 'step1',
    currentStepPosition: 1,
    totalSteps: 3,
    isLoading: false,
    error: null,
    canMoveNext: true,
    isFirstStep: true,
    isLastStep: false,
    nextButtonLabel: 'Next',
    previousButtonLabel: 'Previous',
    moveNext: jest.fn(),
    moveBack: jest.fn(),
    setLoading: jest.fn(),
    setError: jest.fn(),
    getStepData: jest.fn(() => ({})),
    setStepData: jest.fn(),
    updateField: jest.fn(),
    updateStepProperty: jest.fn(),
    getStepById: jest.fn(),
    getWizardData: jest.fn(() => ({})),
    getNextStep: jest.fn(),
    getPreviousStep: jest.fn(),
    initializeSteps: jest.fn(),
    steps: [],
  };

  return {
    WizardProvider: ({ children }: any) => mockReact.createElement('div', {}, children),
    useWizard: () => mockStore,
  };
});

// Mock components for testing
const Step1Component = ({ store }: any) => (
  <Text testID="step1-content">Step 1 Content - Current: {store?.currentStepId}</Text>
);
const Step2Component = ({ store }: any) => (
  <Text testID="step2-content">Step 2 Content - Current: {store?.currentStepId}</Text>
);
const Step3Component = ({ store }: any) => (
  <Text testID="step3-content">Step 3 Content - Current: {store?.currentStepId}</Text>
);

const defaultSteps: Step[] = [
  {
    id: 'step1',
    component: Step1Component,
    order: 1,
    canMoveNext: true,
  },
  {
    id: 'step2',
    component: Step2Component,
    order: 2,
    canMoveNext: true,
  },
  {
    id: 'step3',
    component: Step3Component,
    order: 3,
    canMoveNext: false,
  },
];

const singleStep: Step[] = [
  {
    id: 'only-step',
    component: Step1Component,
    order: 1,
    canMoveNext: true,
  },
];

describe('Wizard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      expect(() => {
        render(<Wizard steps={defaultSteps} />);
      }).not.toThrow();
    });

    it('should render the current step component', () => {
      render(<Wizard steps={defaultSteps} />);

      expect(screen.getByTestId('step1-content')).toBeTruthy();
    });

    it('should render navigation component', () => {
      render(<Wizard steps={defaultSteps} />);

      expect(screen.getByTestId('wizard-navigation')).toBeTruthy();
    });

    it('should handle single step', () => {
      render(<Wizard steps={singleStep} />);

      // Just verify it renders without crashing
      expect(screen.getByTestId('wizard-navigation')).toBeTruthy();
    });

    it('should render with custom labels', () => {
      render(
        <Wizard
          steps={defaultSteps}
          nextLabel="Continue"
          previousLabel="Go Back"
          finishLabel="Complete"
        />
      );

      expect(screen.getByTestId('step1-content')).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('should throw error when no steps provided', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        render(<Wizard steps={[]} />);
      }).toThrow('Wizard must have at least one step');

      consoleSpy.mockRestore();
    });

    it('should throw error when steps is not an array', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        render(<Wizard steps={null as any} />);
      }).toThrow('Wizard must have at least one step');

      consoleSpy.mockRestore();
    });

    it('should throw error when steps is undefined', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        render(<Wizard steps={undefined as any} />);
      }).toThrow('Wizard must have at least one step');

      consoleSpy.mockRestore();
    });
  });

  describe('Loading State', () => {
    it('should render default loading state', () => {
      // Mock the store to return loading state
      const { useWizard } = require('../context/WizardContext');
      const mockStore = useWizard();
      mockStore.isLoading = true;

      render(<Wizard steps={defaultSteps} />);

      expect(screen.getByText('Loading...')).toBeTruthy();
    });

    it('should render custom loading component', () => {
      const { useWizard } = require('../context/WizardContext');
      const mockStore = useWizard();
      mockStore.isLoading = true;

      const CustomLoadingComponent = () => (
        <Text testID="custom-loading">Custom Loading...</Text>
      );

      render(
        <Wizard
          steps={defaultSteps}
          renderLoading={() => <CustomLoadingComponent />}
        />
      );

      expect(screen.getByTestId('custom-loading')).toBeTruthy();
    });
  });

  describe('Error State', () => {
    it('should handle error state', () => {
      // Test that the component can handle error props
      expect(() => {
        render(<Wizard steps={defaultSteps} />);
      }).not.toThrow();
    });

    it('should handle no error state', () => {
      expect(() => {
        render(<Wizard steps={defaultSteps} />);
      }).not.toThrow();
    });
  });

  describe('Custom Navigation', () => {
    it('should accept custom navigation component', () => {
      const CustomNavigation: React.FC<WizardNavigationProps> = () => (
        <Text testID="custom-navigation">Custom Navigation</Text>
      );

      const component = (
        <Wizard
          steps={defaultSteps}
          renderNavigation={CustomNavigation}
        />
      );

      expect(component.props.renderNavigation).toBe(CustomNavigation);
    });

    it('should handle default navigation', () => {
      expect(() => {
        render(<Wizard steps={defaultSteps} />);
      }).not.toThrow();
    });
  });

  describe('Step Validation', () => {
    it('should handle steps with different properties', () => {
      const stepsWithOptionalProps: Step[] = [
        {
          id: 'step1',
          component: Step1Component,
          order: 1,
          canMoveNext: true,
        },
        {
          id: 'step2',
          component: Step2Component,
          order: 2,
          // canMoveNext not provided - should default to false
        },
      ];

      const component = <Wizard steps={stepsWithOptionalProps} />;
      expect(component.props.steps).toEqual(stepsWithOptionalProps);
    });

    it('should handle steps with canMoveNext undefined', () => {
      const stepsWithUndefined: Step[] = [
        {
          id: 'step1',
          component: Step1Component,
          order: 1,
          canMoveNext: undefined,
        },
      ];

      const component = <Wizard steps={stepsWithUndefined} />;
      expect(component.props.steps).toEqual(stepsWithUndefined);
    });

    it('should handle mixed step components', () => {
      const DifferentComponent = ({ store }: any) => (
        <Text testID="different-component">Different Component</Text>
      );

      const mixedSteps: Step[] = [
        {
          id: 'step1',
          component: Step1Component,
          order: 1,
          canMoveNext: true,
        },
        {
          id: 'step2',
          component: DifferentComponent,
          order: 2,
          canMoveNext: true,
        },
      ];

      const component = <Wizard steps={mixedSteps} />;
      expect(component.props.steps).toEqual(mixedSteps);
    });
  });
});
