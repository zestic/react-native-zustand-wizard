import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { WizardNavigation } from './WizardNavigation';
import { View, Text } from 'react-native';
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
    onPress,
    title,
    disabled,
    testID,
    accessibilityState,
  }: any) => (
    <View testID={testID} accessibilityState={accessibilityState}>
      <Text>{title}</Text>
    </View>
  );

  const CustomStepIndicator = ({ currentStep, totalSteps, testID }: any) => (
    <Text testID={testID}>{`Step ${currentStep} of ${totalSteps}`}</Text>
  );

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

    const { getByTestId, queryByTestId } = render(
      <WizardNavigation
        store={{} as any}
        StepIndicatorComponent={CustomStepIndicator}
      />
    );

    expect(queryByTestId('back-button')).toBeNull();
    const nextButton = getByTestId('next-button');
    expect(nextButton.props.accessibilityState.disabled).toBe(true);
    const indicator = getByTestId('step-indicator');
    expect(indicator.props.children).toBe('Step 1 of 2');
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

    const { getByTestId } = render(
      <WizardNavigation
        store={{} as any}
        StepIndicatorComponent={CustomStepIndicator}
      />
    );

    expect(getByTestId('back-button')).toBeTruthy();
    const nextButton = getByTestId('next-button');
    expect(nextButton.props.accessibilityState.disabled).toBe(false);
    const indicator = getByTestId('step-indicator');
    expect(indicator.props.children).toBe('Step 2 of 3');
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

    const { queryByTestId } = render(<WizardNavigation store={{} as any} />);
    expect(queryByTestId('step-indicator')).toBeNull();
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

    const { getByTestId } = render(
      <WizardNavigation
        store={{} as any}
        StepIndicatorComponent={CustomStepIndicator}
      />
    );

    const indicator = getByTestId('step-indicator');
    expect(indicator.props.children).toBe('Step 1 of 2');
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
      const { getByTestId } = render(
        <WizardNavigation
          store={{} as any}
          StepIndicatorComponent={CustomStepIndicator}
          indicatorPosition={position}
        />
      );
      const indicator = getByTestId('step-indicator');
      expect(indicator).toBeTruthy();
    });
  });

  it('should render step indicator between the buttons when indicatorPosition is between', () => {
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

    const { getByTestId } = render(
      <WizardNavigation
        store={{} as any}
        StepIndicatorComponent={CustomStepIndicator}
        indicatorPosition="between"
      />
    );

    const backButton = getByTestId('back-button');
    const nextButton = getByTestId('next-button');
    const indicator = getByTestId('step-indicator');
    expect(backButton).toBeTruthy();
    expect(nextButton).toBeTruthy();
    expect(indicator).toBeTruthy();
  });

  it('should handle navigation actions', async () => {
    const onNext = jest.fn();
    const onPrevious = jest.fn();
    mockNav.mockReturnValue({
      isPreviousHidden: true,
      isNextDisabled: false,
      nextLabel: 'Next',
      previousLabel: 'Back',
      currentStepPosition: 1,
      totalSteps: 2,
      onNext,
      onPrevious,
    });

    const { getByTestId, queryByTestId } = render(
      <WizardNavigation store={{} as any} />
    );

    expect(queryByTestId('back-button')).toBeNull();
    fireEvent.press(getByTestId('next-button'));
    expect(onNext).toHaveBeenCalled();
  });

  it('should not render when store is not provided', () => {
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
    const { queryByTestId } = render(<WizardNavigation store={null as any} />);
    expect(queryByTestId('next-button')).toBeNull();
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

    const { getByTestId } = render(
      <WizardNavigation store={{} as any} ButtonComponent={CustomButton} />
    );

    const nextButton = getByTestId('next-button');
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

    const { getByTestId, rerender } = render(
      <WizardNavigation store={{} as any} ButtonComponent={CustomButton} />
    );

    let nextButton = getByTestId('next-button');
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

    rerender(
      <WizardNavigation store={{} as any} ButtonComponent={CustomButton} />
    );
    nextButton = getByTestId('next-button');
    expect(nextButton.props.accessibilityState.disabled).toBe(false);
  });
});
