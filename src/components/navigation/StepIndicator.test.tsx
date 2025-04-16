import React from 'react';
import { render } from '@testing-library/react-native';
import { View } from 'react-native';
import { StepIndicator } from './StepIndicator';
import { useNavigationContext } from '../../utils/wizardUtils';

jest.mock('../../utils/wizardUtils', () => {
  const actual = jest.requireActual('../../utils/wizardUtils');
  return {
    ...actual,
    useNavigationContext: jest.fn(),
  };
});

const mockNav = useNavigationContext as jest.Mock;

describe('StepIndicator', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    mockNav.mockReturnValue({
      currentStepPosition: 1,
      totalSteps: 3,
      isPreviousHidden: false,
      isNextDisabled: false,
      nextLabel: 'Next',
      previousLabel: 'Back',
      onNext: jest.fn(),
      onPrevious: jest.fn(),
    });
    const { getAllByTestId } = render(
      <StepIndicator />
    );
    const stepIndicators = getAllByTestId('step');
    const connectors = getAllByTestId('connector');
    expect(stepIndicators).toHaveLength(3);
    expect(connectors).toHaveLength(2);
  });

  it('applies custom styles', () => {
    mockNav.mockReturnValue({
      currentStepPosition: 1,
      totalSteps: 3,
      isPreviousHidden: false,
      isNextDisabled: false,
      nextLabel: 'Next',
      previousLabel: 'Back',
      onNext: jest.fn(),
      onPrevious: jest.fn(),
    });
    const customStyle = { backgroundColor: 'red' };
    const { getByTestId } = render(
      <StepIndicator style={customStyle} />
    );
    const container = getByTestId('step-indicator');
    expect(container.props.style).toContainEqual(customStyle);
  });

  it('shows correct step states', () => {
    mockNav.mockReturnValue({
      currentStepPosition: 2,
      totalSteps: 3,
      isPreviousHidden: false,
      isNextDisabled: false,
      nextLabel: 'Next',
      previousLabel: 'Back',
      onNext: jest.fn(),
      onPrevious: jest.fn(),
    });
    const { getAllByTestId } = render(
      <StepIndicator />
    );
    const stepIndicators = getAllByTestId('step');
    const connectors = getAllByTestId('connector');
    // First step should be completed
    expect(stepIndicators[0].props.style).toContainEqual(expect.objectContaining({
      backgroundColor: '#4CAF50'
    }));
    expect(connectors[0].props.style).toContainEqual(expect.objectContaining({
      backgroundColor: '#4CAF50'
    }));
    // Second step should be current
    expect(stepIndicators[1].props.style).toContainEqual(expect.objectContaining({
      backgroundColor: '#2196F3'
    }));
    // Third step should be pending
    expect(stepIndicators[2].props.style).toContainEqual(expect.objectContaining({
      backgroundColor: '#E0E0E0'
    }));
  });
}); 