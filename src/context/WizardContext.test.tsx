import React from 'react';
import { render, screen, act } from '@testing-library/react-native';
import { Text } from 'react-native';
import { WizardProvider, useWizardContext, useWizard } from './WizardContext';

// Mock the WizardStore
const mockInitializeSteps = jest.fn();
const mockStore = {
  initializeSteps: mockInitializeSteps,
  currentStepId: 'step1',
  currentStepPosition: 1,
  totalSteps: 2,
  isLoading: false,
  error: '',
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
  steps: [],
};

jest.mock('../stores/WizardStore', () => ({
  useWizardStore: jest.fn(() => mockStore),
}));

const defaultSteps = [
  {
    id: 'step1',
    order: 1,
    canMoveNext: true,
  },
  {
    id: 'step2',
    order: 2,
    canMoveNext: false,
  },
];

// Test component that uses the context
const TestComponent = () => {
  const context = useWizardContext();
  return (
    <Text testID="test-component">
      Current Step: {context.store.currentStepId}
    </Text>
  );
};

// Test component that uses the useWizard hook
const TestWizardHookComponent = () => {
  const store = useWizard();
  return (
    <Text testID="test-wizard-hook">Position: {store.currentStepPosition}</Text>
  );
};

// Test component that throws error when used outside provider
const TestComponentOutsideProvider = () => {
  try {
    useWizardContext();
    return <Text testID="no-error">No Error</Text>;
  } catch (error) {
    return <Text testID="error-caught">{(error as Error).message}</Text>;
  }
};

describe('WizardContext', () => {
  describe('WizardProvider', () => {
    it('should render children correctly', () => {
      render(
        <WizardProvider steps={defaultSteps}>
          <Text testID="child">Child Component</Text>
        </WizardProvider>
      );

      expect(screen.getByTestId('child')).toBeTruthy();
    });

    it('should provide context value to children', () => {
      render(
        <WizardProvider steps={defaultSteps}>
          <TestComponent />
        </WizardProvider>
      );

      expect(screen.getByTestId('test-component')).toBeTruthy();
      expect(screen.getByText('Current Step: step1')).toBeTruthy();
    });

    it('should initialize store with provided steps', () => {
      render(
        <WizardProvider steps={defaultSteps}>
          <TestComponent />
        </WizardProvider>
      );

      expect(mockInitializeSteps).toHaveBeenCalledWith(
        defaultSteps,
        'Next',
        'Previous',
        'Finish'
      );
    });

    it('should handle custom labels', () => {
      mockInitializeSteps.mockClear();

      render(
        <WizardProvider
          steps={defaultSteps}
          nextLabel="Continue"
          previousLabel="Go Back"
          finishLabel="Complete"
        >
          <TestComponent />
        </WizardProvider>
      );

      expect(mockInitializeSteps).toHaveBeenCalledWith(
        defaultSteps,
        'Continue',
        'Go Back',
        'Complete'
      );
    });

    it('should use default labels when not provided', () => {
      mockInitializeSteps.mockClear();

      render(
        <WizardProvider steps={defaultSteps}>
          <TestComponent />
        </WizardProvider>
      );

      expect(mockInitializeSteps).toHaveBeenCalledWith(
        defaultSteps,
        'Next',
        'Previous',
        'Finish'
      );
    });

    it('should re-initialize when steps change', () => {
      mockInitializeSteps.mockClear();

      const { rerender } = render(
        <WizardProvider steps={defaultSteps}>
          <TestComponent />
        </WizardProvider>
      );

      const newSteps = [
        {
          id: 'new-step1',
          order: 1,
          canMoveNext: true,
        },
      ];

      rerender(
        <WizardProvider steps={newSteps}>
          <TestComponent />
        </WizardProvider>
      );

      expect(mockInitializeSteps).toHaveBeenCalledTimes(2);
      expect(mockInitializeSteps).toHaveBeenLastCalledWith(
        newSteps,
        'Next',
        'Previous',
        'Finish'
      );
    });

    it('should re-initialize when labels change', () => {
      mockInitializeSteps.mockClear();

      const { rerender } = render(
        <WizardProvider steps={defaultSteps} nextLabel="Next">
          <TestComponent />
        </WizardProvider>
      );

      rerender(
        <WizardProvider steps={defaultSteps} nextLabel="Continue">
          <TestComponent />
        </WizardProvider>
      );

      expect(mockInitializeSteps).toHaveBeenCalledTimes(2);
      expect(mockInitializeSteps).toHaveBeenLastCalledWith(
        defaultSteps,
        'Continue',
        'Previous',
        'Finish'
      );
    });

    it('should not initialize when steps are empty', () => {
      mockInitializeSteps.mockClear();

      render(
        <WizardProvider steps={[]}>
          <TestComponent />
        </WizardProvider>
      );

      expect(mockInitializeSteps).not.toHaveBeenCalled();
    });

    it('should not initialize when steps are null', () => {
      mockInitializeSteps.mockClear();

      render(
        <WizardProvider steps={null as any}>
          <TestComponent />
        </WizardProvider>
      );

      expect(mockInitializeSteps).not.toHaveBeenCalled();
    });
  });

  describe('useWizardContext', () => {
    it('should return context value when used within provider', () => {
      render(
        <WizardProvider steps={defaultSteps}>
          <TestComponent />
        </WizardProvider>
      );

      expect(screen.getByTestId('test-component')).toBeTruthy();
    });

    it('should throw error when used outside provider', () => {
      render(<TestComponentOutsideProvider />);

      expect(screen.getByTestId('error-caught')).toBeTruthy();
      expect(
        screen.getByText(
          'useWizardContext must be used within a WizardProvider'
        )
      ).toBeTruthy();
    });

    it('should provide store instance', () => {
      let contextValue: any;

      const TestContextValue = () => {
        contextValue = useWizardContext();
        return <Text testID="context-test">Test</Text>;
      };

      render(
        <WizardProvider steps={defaultSteps}>
          <TestContextValue />
        </WizardProvider>
      );

      expect(contextValue).toBeDefined();
      expect(contextValue.store).toBeDefined();
      expect(typeof contextValue.store.currentStepId).toBe('string');
    });
  });

  describe('useWizard', () => {
    it('should return store directly', () => {
      render(
        <WizardProvider steps={defaultSteps}>
          <TestWizardHookComponent />
        </WizardProvider>
      );

      expect(screen.getByTestId('test-wizard-hook')).toBeTruthy();
      expect(screen.getByText('Position: 1')).toBeTruthy();
    });

    it('should throw error when used outside provider', () => {
      const TestWizardHookOutsideProvider = () => {
        try {
          useWizard();
          return <Text testID="no-error">No Error</Text>;
        } catch (error) {
          return <Text testID="error-caught">{(error as Error).message}</Text>;
        }
      };

      render(<TestWizardHookOutsideProvider />);

      expect(screen.getByTestId('error-caught')).toBeTruthy();
      expect(
        screen.getByText(
          'useWizardContext must be used within a WizardProvider'
        )
      ).toBeTruthy();
    });

    it('should provide access to all store methods', () => {
      let store: any;

      const TestStoreAccess = () => {
        store = useWizard();
        return <Text testID="store-test">Test</Text>;
      };

      render(
        <WizardProvider steps={defaultSteps}>
          <TestStoreAccess />
        </WizardProvider>
      );

      expect(store).toBeDefined();
      expect(typeof store.moveNext).toBe('function');
      expect(typeof store.moveBack).toBe('function');
      expect(typeof store.setLoading).toBe('function');
      expect(typeof store.setError).toBe('function');
      expect(typeof store.getStepData).toBe('function');
      expect(typeof store.setStepData).toBe('function');
    });
  });

  describe('Context Updates', () => {
    it('should provide context to children', () => {
      render(
        <WizardProvider steps={defaultSteps}>
          <TestComponent />
        </WizardProvider>
      );

      expect(screen.getByText('Current Step: step1')).toBeTruthy();
    });

    it('should handle provider remounting', () => {
      mockInitializeSteps.mockClear();

      const { unmount } = render(
        <WizardProvider steps={defaultSteps}>
          <TestComponent />
        </WizardProvider>
      );

      // First mount should call initialize
      expect(mockInitializeSteps).toHaveBeenCalledTimes(1);

      unmount();
      mockInitializeSteps.mockClear(); // Clear for second mount

      render(
        <WizardProvider steps={defaultSteps}>
          <TestComponent />
        </WizardProvider>
      );

      // Second mount should also call initialize
      expect(mockInitializeSteps).toHaveBeenCalledTimes(1);
    });
  });
});
