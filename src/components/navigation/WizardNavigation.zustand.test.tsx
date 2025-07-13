import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { WizardNavigationZustand } from './WizardNavigation.zustand';
import { WizardProvider } from '../../context/WizardContext';

// Mock the useNavigationContext hook
jest.mock('../../utils/wizardUtils.zustand', () => ({
  useNavigationContext: jest.fn(),
}));

const mockUseNavigationContext = require('../../utils/wizardUtils.zustand').useNavigationContext;

const defaultSteps = [
  { id: 'step1', order: 1, canMoveNext: true },
  { id: 'step2', order: 2, canMoveNext: false },
];

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <WizardProvider steps={defaultSteps}>
      {component}
    </WizardProvider>
  );
};

describe('WizardNavigationZustand', () => {
  const mockOnNext = jest.fn();
  const mockOnPrevious = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNavigationContext.mockReturnValue({
      isPreviousHidden: false,
      isNextDisabled: false,
      nextLabel: 'Next',
      previousLabel: 'Previous',
      currentStepPosition: 1,
      totalSteps: 2,
      onNext: mockOnNext,
      onPrevious: mockOnPrevious,
    });
  });

  it('should render navigation buttons', () => {
    const { getByText } = renderWithProvider(<WizardNavigationZustand />);
    
    expect(getByText('Next')).toBeTruthy();
    expect(getByText('Previous')).toBeTruthy();
  });

  it('should call onNext when next button is pressed', () => {
    const { getByText } = renderWithProvider(<WizardNavigationZustand />);
    
    fireEvent.press(getByText('Next'));
    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('should call onPrevious when previous button is pressed', () => {
    const { getByText } = renderWithProvider(<WizardNavigationZustand />);
    
    fireEvent.press(getByText('Previous'));
    expect(mockOnPrevious).toHaveBeenCalledTimes(1);
  });

  it('should hide previous button when isPreviousHidden is true', () => {
    mockUseNavigationContext.mockReturnValue({
      isPreviousHidden: true,
      isNextDisabled: false,
      nextLabel: 'Next',
      previousLabel: 'Previous',
      currentStepPosition: 1,
      totalSteps: 2,
      onNext: mockOnNext,
      onPrevious: mockOnPrevious,
    });

    const { queryByText } = renderWithProvider(<WizardNavigationZustand />);
    
    expect(queryByText('Previous')).toBeNull();
    expect(queryByText('Next')).toBeTruthy();
  });

  it('should disable next button when isNextDisabled is true', () => {
    mockUseNavigationContext.mockReturnValue({
      isPreviousHidden: false,
      isNextDisabled: true,
      nextLabel: 'Next',
      previousLabel: 'Previous',
      currentStepPosition: 2,
      totalSteps: 2,
      onNext: mockOnNext,
      onPrevious: mockOnPrevious,
    });

    const { getByText } = renderWithProvider(<WizardNavigationZustand />);
    
    const nextButton = getByText('Next');
    expect(nextButton).toBeTruthy();
    
    // Try to press the disabled button
    fireEvent.press(nextButton);
    // onNext should not be called when button is disabled
    expect(mockOnNext).not.toHaveBeenCalled();
  });

  it('should display custom button labels', () => {
    mockUseNavigationContext.mockReturnValue({
      isPreviousHidden: false,
      isNextDisabled: false,
      nextLabel: 'Continue',
      previousLabel: 'Go Back',
      currentStepPosition: 1,
      totalSteps: 2,
      onNext: mockOnNext,
      onPrevious: mockOnPrevious,
    });

    const { getByText } = renderWithProvider(<WizardNavigationZustand />);
    
    expect(getByText('Continue')).toBeTruthy();
    expect(getByText('Go Back')).toBeTruthy();
  });

  it('should render with custom button component', () => {
    const CustomButton = ({ title, onPress }: { title: string; onPress: () => void }) => (
      <button onPress={onPress}>{title} Custom</button>
    );

    const result = renderWithProvider(
      <WizardNavigationZustand ButtonComponent={CustomButton} />
    );

    // Check that the custom button component is being used
    // by looking for the button elements
    const buttons = result.root.findAllByType('button');
    expect(buttons).toHaveLength(2);
  });
});
