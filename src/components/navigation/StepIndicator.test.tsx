import React from 'react';
import { render } from '@testing-library/react-native';
import { View } from 'react-native';
import { StepIndicator } from './StepIndicator';
import { useNavigationContext } from '../../utils/wizardUtils';
import { colors } from '../../theme/colors';

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

  it('renders with correct accessibility labels', () => {
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

    const { getByLabelText, getAllByRole } = render(<StepIndicator />);

    // Check main container accessibility
    const container = getByLabelText('Step progress: 1 of 3 steps');
    expect(container).toBeTruthy();

    // Check individual steps
    const steps = getAllByRole('progressbar');
    expect(steps).toHaveLength(4); // 3 steps + container

    // Check step labels
    expect(getByLabelText('Step 1 current')).toBeTruthy();
    expect(getByLabelText('Step 2 pending')).toBeTruthy();
    expect(getByLabelText('Step 3 pending')).toBeTruthy();
  });

  it('shows correct step states and labels', () => {
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

    const { getByLabelText, getAllByRole } = render(<StepIndicator />);

    // Check container label
    expect(getByLabelText('Step progress: 2 of 3 steps')).toBeTruthy();

    // Check individual step labels
    const step1 = getByLabelText('Step 1 completed');
    const step2 = getByLabelText('Step 2 current');
    const step3 = getByLabelText('Step 3 pending');

    // Check visual styles
    expect(step1.props.style).toContainEqual(
      expect.objectContaining({
        backgroundColor: colors.secondary,
      })
    );

    expect(step2.props.style).toContainEqual(
      expect.objectContaining({
        backgroundColor: colors.primary,
      })
    );

    expect(step3.props.style).toContainEqual(
      expect.objectContaining({
        backgroundColor: colors.gray300,
      })
    );

    // Check connectors
    const connectors = getAllByRole('none');
    expect(connectors).toHaveLength(2);
    expect(connectors[0].props.style).toContainEqual(
      expect.objectContaining({
        backgroundColor: colors.secondary,
      })
    );
  });
});
