import React from 'react';
import { render, fireEvent, RenderAPI, screen } from '@testing-library/react-native';
import { WizardNavigation } from './WizardNavigation';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigationContext } from '../../utils/wizardUtils';

jest.mock('../../utils/wizardUtils', () => {
  const actual = jest.requireActual('../../utils/wizardUtils');
  return {
    ...actual,
    useNavigationContext: jest.fn(),
  };
});

const mockNav = useNavigationContext as jest.Mock;

describe('WizardNavigation', () => {
  const CustomButton = ({
    title,
    disabled,
  }: any) => (
    <TouchableOpacity accessibilityState={{ disabled }} accessibilityRole="button">
      <Text>{title}</Text>
    </TouchableOpacity>
  );

  const CustomStepIndicator = () => {
    const { currentStepPosition, totalSteps } = useNavigationContext();
    return (
      <View
        accessible={true}
        accessibilityRole="progressbar"
        accessibilityLabel={`Step progress: ${currentStepPosition} of ${totalSteps} steps`}
      >
        <Text>{`Step ${currentStepPosition} of ${totalSteps}`}</Text>
      </View>
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly for first step', () => {
    mockNav.mockReturnValue({
      isPreviousHidden: true,
      isNextDisabled: true,
      nextLabel: 'Next',
      previousLabel: 'Back',
      currentStepPosition: 1,
      totalSteps: 2,
      onNext: jest.fn(),
      onPrevious: jest.fn(),
    });

    render(
      <WizardNavigation
        StepIndicatorComponent={CustomStepIndicator}
      />
    );

    // Verify back button is not present
    const backButton = screen.queryByRole('button', { name: 'Back' });
    expect(backButton).toBeNull();

    // Verify next button is present but disabled
    const nextButton = screen.getByRole('button', { name: 'Next' });
    expect(nextButton.props.accessibilityState.disabled).toBe(true);

    // Verify step indicator
    const indicator = screen.getByLabelText('Step progress: 1 of 2 steps');
    expect(indicator).toBeTruthy();
  });

  it('should render correctly for middle step', () => {
    mockNav.mockReturnValue({
      isPreviousHidden: false,
      isNextDisabled: false,
      nextLabel: 'Next',
      previousLabel: 'Back',
      currentStepPosition: 2,
      totalSteps: 3,
      onNext: jest.fn(),
      onPrevious: jest.fn(),
    });

    const { getByRole } = render(
      <WizardNavigation
        StepIndicatorComponent={CustomStepIndicator}
      />
    );

    // Verify back button is present and enabled
    const backButton = screen.getByRole('button', { name: 'Back' });
    expect(backButton).toBeTruthy();
    expect(backButton.props.accessibilityState?.disabled).toBeFalsy();

    // Verify next button is present and enabled
    const nextButton = screen.getByRole('button', { name: 'Next' });
    expect(nextButton.props.accessibilityState?.disabled).toBeFalsy();

    // Verify step indicator
    const indicator = screen.getByLabelText('Step progress: 2 of 3 steps');
    expect(indicator).toBeTruthy();
  });

  it('should render without step indicator when no StepIndicatorComponent is provided', () => {
    mockNav.mockReturnValue({
      isPreviousHidden: true,
      isNextDisabled: false,
      nextLabel: 'Next',
      previousLabel: 'Back',
      currentStepPosition: 1,
      totalSteps: 2,
      onNext: jest.fn(),
      onPrevious: jest.fn(),
    });

    render(<WizardNavigation />);
    const indicator = screen.queryByRole('text', { name: /Step .* of .*/ });
    expect(indicator).toBeNull();
  });

  it('should render step indicator in default position (between)', () => {
    mockNav.mockReturnValue({
      isPreviousHidden: true,
      isNextDisabled: false,
      nextLabel: 'Next',
      previousLabel: 'Back',
      currentStepPosition: 1,
      totalSteps: 2,
      onNext: jest.fn(),
      onPrevious: jest.fn(),
    });

    render(
      <WizardNavigation
        StepIndicatorComponent={CustomStepIndicator}
      />
    );

    const indicator = screen.getByLabelText('Step progress: 1 of 2 steps');
    expect(indicator).toBeTruthy();
  });

  it('should render step indicator in specified position', () => {
    mockNav.mockReturnValue({
      isPreviousHidden: false,
      isNextDisabled: false,
      nextLabel: 'Next',
      previousLabel: 'Back',
      currentStepPosition: 1,
      totalSteps: 2,
      onNext: jest.fn(),
      onPrevious: jest.fn(),
    });

    const positions: ('above' | 'between' | 'below')[] = [
      'above',
      'between',
      'below',
    ];

    positions.forEach((position) => {
      render(
        <WizardNavigation
          StepIndicatorComponent={CustomStepIndicator}
          indicatorPosition={position}
        />
      );
      const indicator = screen.getByLabelText('Step progress: 1 of 2 steps');
      expect(indicator).toBeTruthy();
    });
  });

  it('should handle navigation actions', () => {
    const onNext = jest.fn();
    const onPrevious = jest.fn();
    mockNav.mockReturnValue({
      isPreviousHidden: false,
      isNextDisabled: false,
      nextLabel: 'Next',
      previousLabel: 'Back',
      currentStepPosition: 1,
      totalSteps: 2,
      onNext,
      onPrevious,
    });

    render(
      <WizardNavigation />
    );

    // Test next button
    const nextButton = screen.getByRole('button', { name: 'Next' });
    fireEvent.press(nextButton);
    expect(onNext).toHaveBeenCalled();

    // Test back button
    const backButton = screen.getByRole('button', { name: 'Back' });
    fireEvent.press(backButton);
    expect(onPrevious).toHaveBeenCalled();
  });

  it('should use custom button component when provided', () => {
    mockNav.mockReturnValue({
      isPreviousHidden: false,
      isNextDisabled: false,
      nextLabel: 'Next',
      previousLabel: 'Back',
      currentStepPosition: 1,
      totalSteps: 2,
      onNext: jest.fn(),
      onPrevious: jest.fn(),
    });

    render(
      <WizardNavigation ButtonComponent={CustomButton} />
    );

    const nextButton = screen.getByRole('button', { name: 'Next' });
    expect(nextButton).toBeTruthy();
    expect(nextButton.props.accessibilityState.disabled).toBe(false);
  });

  it('should correctly handle disabled state based on canMoveNext', () => {
    // Test case 1: canMoveNext is false
    mockNav.mockReturnValue({
      isPreviousHidden: false,
      isNextDisabled: true, // This should be true when canMoveNext is false
      nextLabel: 'Next',
      previousLabel: 'Back',
      currentStepPosition: 1,
      totalSteps: 2,
      onNext: jest.fn(),
      onPrevious: jest.fn(),
    });

    render(
      <WizardNavigation ButtonComponent={CustomButton} />
    );

    const nextButton = screen.getByRole('button', { name: 'Next' });
    expect(nextButton.props.accessibilityState.disabled).toBe(true);

    // Test case 2: canMoveNext is true
    mockNav.mockReturnValue({
      isPreviousHidden: false,
      isNextDisabled: false, // This should be false when canMoveNext is true
      nextLabel: 'Next',
      previousLabel: 'Back',
      currentStepPosition: 1,
      totalSteps: 2,
      onNext: jest.fn(),
      onPrevious: jest.fn(),
    });

    render(
      <WizardNavigation ButtonComponent={CustomButton} />
    );
    const updatedNextButton = screen.getByRole('button', { name: 'Next' });
    expect(updatedNextButton.props.accessibilityState.disabled).toBe(false);
  });
});
