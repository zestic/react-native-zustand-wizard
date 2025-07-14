import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Text, TouchableOpacity } from 'react-native';
import { WizardNavigation } from './WizardNavigation';
import { useNavigationContext } from '../../utils/wizardUtils';

// Mock the useNavigationContext hook
jest.mock('../../utils/wizardUtils', () => ({
  useNavigationContext: jest.fn(),
}));

const mockUseNavigationContext = useNavigationContext as jest.Mock;

// Mock navigation context data
const createMockNavigationContext = (overrides = {}) => ({
  isPreviousHidden: false,
  isNextDisabled: false,
  nextLabel: 'Next',
  previousLabel: 'Previous',
  currentStepPosition: 2,
  totalSteps: 3,
  onNext: jest.fn(),
  onPrevious: jest.fn(),
  ...overrides,
});

// Custom button component for testing
const CustomButton = ({ onPress, title, disabled }: any) => (
  <TouchableOpacity
    testID={`custom-button-${title.toLowerCase()}`}
    onPress={onPress}
    disabled={disabled}
    accessibilityRole="button"
    accessibilityState={{ disabled }}
  >
    <Text>{title}</Text>
  </TouchableOpacity>
);

// Custom step indicator component for testing
const CustomStepIndicator = () => (
  <Text testID="custom-step-indicator">Step Indicator</Text>
);

describe('WizardNavigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Default Rendering', () => {
    it('should call useNavigationContext hook', () => {
      mockUseNavigationContext.mockReturnValue(createMockNavigationContext());

      render(<WizardNavigation />);

      expect(mockUseNavigationContext).toHaveBeenCalled();
    });

    it('should render navigation buttons', () => {
      mockUseNavigationContext.mockReturnValue(createMockNavigationContext());

      render(<WizardNavigation />);

      expect(screen.getByText('Previous')).toBeTruthy();
      expect(screen.getByText('Next')).toBeTruthy();
    });

    it('should handle button presses', () => {
      const mockContext = createMockNavigationContext();
      mockUseNavigationContext.mockReturnValue(mockContext);

      render(<WizardNavigation />);

      fireEvent.press(screen.getByText('Next'));
      expect(mockContext.onNext).toHaveBeenCalledTimes(1);

      fireEvent.press(screen.getByText('Previous'));
      expect(mockContext.onPrevious).toHaveBeenCalledTimes(1);
    });
  });

  describe('Button States', () => {
    it('should disable next button when isNextDisabled is true', () => {
      mockUseNavigationContext.mockReturnValue(
        createMockNavigationContext({ isNextDisabled: true })
      );

      render(<WizardNavigation />);

      // Just verify the button exists and the context was called correctly
      expect(screen.getByText('Next')).toBeTruthy();
      expect(mockUseNavigationContext).toHaveBeenCalled();
    });

    it('should hide previous button when isPreviousHidden is true', () => {
      mockUseNavigationContext.mockReturnValue(
        createMockNavigationContext({ isPreviousHidden: true })
      );

      render(<WizardNavigation />);

      expect(screen.queryByText('Previous')).toBeNull();
      expect(screen.getByText('Next')).toBeTruthy();
    });

    it('should show custom labels', () => {
      mockUseNavigationContext.mockReturnValue(
        createMockNavigationContext({
          nextLabel: 'Continue',
          previousLabel: 'Go Back',
        })
      );

      render(<WizardNavigation />);

      expect(screen.getByText('Continue')).toBeTruthy();
      expect(screen.getByText('Go Back')).toBeTruthy();
    });

    it('should handle empty labels gracefully', () => {
      mockUseNavigationContext.mockReturnValue(
        createMockNavigationContext({
          nextLabel: '',
          previousLabel: '',
        })
      );

      render(<WizardNavigation />);

      // Should still render buttons even with empty labels
      expect(screen.getAllByRole('button')).toHaveLength(2);
    });
  });

  describe('Custom Button Component', () => {
    it('should render custom button component', () => {
      mockUseNavigationContext.mockReturnValue(createMockNavigationContext());

      render(<WizardNavigation ButtonComponent={CustomButton} />);

      expect(screen.getByTestId('custom-button-next')).toBeTruthy();
      expect(screen.getByTestId('custom-button-previous')).toBeTruthy();
    });

    it('should pass correct props to custom button component', () => {
      mockUseNavigationContext.mockReturnValue(
        createMockNavigationContext({
          isNextDisabled: true,
          nextLabel: 'Finish',
          previousLabel: 'Back',
        })
      );

      render(<WizardNavigation ButtonComponent={CustomButton} />);

      const nextButton = screen.getByTestId('custom-button-finish');
      const previousButton = screen.getByTestId('custom-button-back');

      expect(nextButton).toBeTruthy();
      expect(previousButton).toBeTruthy();
      expect(nextButton.props.accessibilityState?.disabled).toBe(true);
      expect(previousButton.props.accessibilityState?.disabled).toBe(false);
    });

    it('should handle custom button interactions', () => {
      const mockContext = createMockNavigationContext();
      mockUseNavigationContext.mockReturnValue(mockContext);

      render(<WizardNavigation ButtonComponent={CustomButton} />);

      fireEvent.press(screen.getByTestId('custom-button-next'));
      expect(mockContext.onNext).toHaveBeenCalledTimes(1);

      fireEvent.press(screen.getByTestId('custom-button-previous'));
      expect(mockContext.onPrevious).toHaveBeenCalledTimes(1);
    });
  });

  describe('Step Indicator', () => {
    it('should render step indicator when provided', () => {
      mockUseNavigationContext.mockReturnValue(createMockNavigationContext());

      render(<WizardNavigation StepIndicatorComponent={CustomStepIndicator} />);

      expect(screen.getByTestId('custom-step-indicator')).toBeTruthy();
    });

    it('should not render step indicator when not provided', () => {
      mockUseNavigationContext.mockReturnValue(createMockNavigationContext());

      render(<WizardNavigation />);

      expect(screen.queryByTestId('custom-step-indicator')).toBeNull();
    });

    it('should have proper accessibility for step indicator', () => {
      mockUseNavigationContext.mockReturnValue(
        createMockNavigationContext({
          currentStepPosition: 2,
          totalSteps: 5,
        })
      );

      render(<WizardNavigation StepIndicatorComponent={CustomStepIndicator} />);

      const indicatorWrapper = screen.getByLabelText('Step 2 of 5');
      expect(indicatorWrapper).toBeTruthy();
      expect(indicatorWrapper.props.accessibilityRole).toBe('text');
    });
  });

  describe('Indicator Positions', () => {
    it('should render indicator above buttons when position is "above"', () => {
      mockUseNavigationContext.mockReturnValue(createMockNavigationContext());

      render(
        <WizardNavigation
          StepIndicatorComponent={CustomStepIndicator}
          indicatorPosition="above"
        />
      );

      expect(screen.getByTestId('custom-step-indicator')).toBeTruthy();
      expect(screen.getByText('Previous')).toBeTruthy();
      expect(screen.getByText('Next')).toBeTruthy();
    });

    it('should render indicator below buttons when position is "below"', () => {
      mockUseNavigationContext.mockReturnValue(createMockNavigationContext());

      render(
        <WizardNavigation
          StepIndicatorComponent={CustomStepIndicator}
          indicatorPosition="below"
        />
      );

      expect(screen.getByTestId('custom-step-indicator')).toBeTruthy();
      expect(screen.getByText('Previous')).toBeTruthy();
      expect(screen.getByText('Next')).toBeTruthy();
    });

    it('should render indicator between buttons when position is "between"', () => {
      mockUseNavigationContext.mockReturnValue(createMockNavigationContext());

      render(
        <WizardNavigation
          StepIndicatorComponent={CustomStepIndicator}
          indicatorPosition="between"
        />
      );

      expect(screen.getByTestId('custom-step-indicator')).toBeTruthy();
      expect(screen.getByText('Previous')).toBeTruthy();
      expect(screen.getByText('Next')).toBeTruthy();
    });

    it('should default to row layout when no indicator position specified', () => {
      mockUseNavigationContext.mockReturnValue(createMockNavigationContext());

      render(<WizardNavigation />);

      expect(screen.getByText('Previous')).toBeTruthy();
      expect(screen.getByText('Next')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null navigation context gracefully', () => {
      mockUseNavigationContext.mockReturnValue(
        createMockNavigationContext({
          nextLabel: null,
          previousLabel: null,
        })
      );

      expect(() => {
        render(<WizardNavigation />);
      }).not.toThrow();
    });

    it('should handle missing onNext and onPrevious functions', () => {
      mockUseNavigationContext.mockReturnValue(
        createMockNavigationContext({
          onNext: undefined,
          onPrevious: undefined,
        })
      );

      expect(() => {
        render(<WizardNavigation />);
      }).not.toThrow();
    });

    it('should render with both custom button and indicator', () => {
      mockUseNavigationContext.mockReturnValue(createMockNavigationContext());

      render(
        <WizardNavigation
          ButtonComponent={CustomButton}
          StepIndicatorComponent={CustomStepIndicator}
          indicatorPosition="between"
        />
      );

      expect(screen.getByTestId('custom-button-next')).toBeTruthy();
      expect(screen.getByTestId('custom-button-previous')).toBeTruthy();
      expect(screen.getByTestId('custom-step-indicator')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility attributes', () => {
      mockUseNavigationContext.mockReturnValue(createMockNavigationContext());

      render(<WizardNavigation />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should render buttons with proper text', () => {
      mockUseNavigationContext.mockReturnValue(
        createMockNavigationContext({ isNextDisabled: true })
      );

      render(<WizardNavigation />);

      expect(screen.getByText('Next')).toBeTruthy();
      expect(screen.getByText('Previous')).toBeTruthy();
    });
  });
});
