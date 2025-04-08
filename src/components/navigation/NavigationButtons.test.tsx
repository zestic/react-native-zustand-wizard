import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationButtons, ButtonProps } from './NavigationButtons';
import { WizardStoreType } from '../../types/store';
import { StepConfig } from '../../types';
import { TouchableOpacity, Text } from 'react-native';

// Mock the WizardStore
jest.mock('../../stores/WizardStore', () => ({
  WizardStore: {
    create: jest.fn(),
  },
}));

describe('NavigationButtons', () => {
  // Helper function to create a mock store
  const createMockStore = (currentStepIndex = 0, isHidden = false): Partial<WizardStoreType> => {
    const mockStore = {
      getCanMoveNext: jest.fn().mockReturnValue(true),
      getCanMoveBack: jest.fn().mockReturnValue(true),
      getVisibleStepIndex: jest.fn().mockReturnValue(currentStepIndex),
      getCurrentStep: jest.fn().mockReturnValue({ hidden: isHidden }),
    };
    return mockStore;
  };

  it('renders both back and next buttons by default', () => {
    const mockStore = createMockStore(1) as WizardStoreType; // Not first step
    const onNext = jest.fn();
    const onBack = jest.fn();

    const { getByTestId } = render(
      <NavigationButtons
        store={mockStore}
        onNext={onNext}
        onBack={onBack}
      />
    );

    expect(getByTestId('back-button')).toBeTruthy();
    expect(getByTestId('next-button')).toBeTruthy();
  });

  it('hides back button on first step', () => {
    const mockStore = createMockStore(0) as WizardStoreType; // First step
    const onNext = jest.fn();
    const onBack = jest.fn();

    const { queryByTestId, getByTestId } = render(
      <NavigationButtons
        store={mockStore}
        onNext={onNext}
        onBack={onBack}
      />
    );

    expect(queryByTestId('back-button')).toBeNull();
    expect(getByTestId('next-button')).toBeTruthy();
  });

  it('hides back button when step has hidden property set to true', () => {
    const mockStore = createMockStore(1, true) as WizardStoreType; // Not first step, but hidden
    const onNext = jest.fn();
    const onBack = jest.fn();

    const { queryByTestId, getByTestId } = render(
      <NavigationButtons
        store={mockStore}
        onNext={onNext}
        onBack={onBack}
      />
    );

    expect(queryByTestId('back-button')).toBeNull();
    expect(getByTestId('next-button')).toBeTruthy();
  });

  it('calls onNext when next button is pressed', () => {
    const mockStore = createMockStore() as WizardStoreType;
    const onNext = jest.fn();
    const onBack = jest.fn();

    const { getByTestId } = render(
      <NavigationButtons
        store={mockStore}
        onNext={onNext}
        onBack={onBack}
      />
    );

    fireEvent.press(getByTestId('next-button'));
    expect(onNext).toHaveBeenCalled();
  });

  it('calls onBack when back button is pressed', () => {
    const mockStore = createMockStore(1) as WizardStoreType; // Not first step
    const onNext = jest.fn();
    const onBack = jest.fn();

    const { getByTestId } = render(
      <NavigationButtons
        store={mockStore}
        onNext={onNext}
        onBack={onBack}
      />
    );

    fireEvent.press(getByTestId('back-button'));
    expect(onBack).toHaveBeenCalled();
  });

  it('disables next button when canMoveNext is false', () => {
    const mockStore = {
      ...createMockStore(),
      getCanMoveNext: jest.fn().mockReturnValue(false),
    } as WizardStoreType;
    const onNext = jest.fn();
    const onBack = jest.fn();

    const { getByTestId } = render(
      <NavigationButtons
        store={mockStore}
        onNext={onNext}
        onBack={onBack}
      />
    );

    const nextButton = getByTestId('next-button');
    expect(nextButton.props.accessibilityState.disabled).toBe(true);
  });

  it('disables back button when canMoveBack is false', () => {
    const mockStore = {
      ...createMockStore(1), // Not first step
      getCanMoveBack: jest.fn().mockReturnValue(false),
    } as WizardStoreType;
    const onNext = jest.fn();
    const onBack = jest.fn();

    const { getByTestId } = render(
      <NavigationButtons
        store={mockStore}
        onNext={onNext}
        onBack={onBack}
      />
    );

    const backButton = getByTestId('back-button');
    expect(backButton.props.accessibilityState.disabled).toBe(true);
  });

  it('renders custom next button when provided', () => {
    const mockStore = createMockStore() as WizardStoreType;
    const onNext = jest.fn();
    const onBack = jest.fn();
    const CustomButton = ({ label, onPress, disabled }: ButtonProps) => (
      <TouchableOpacity
        testID={`custom-${label?.toLowerCase()}`}
        onPress={onPress}
        disabled={disabled}
      >
        <Text>Custom {label}</Text>
      </TouchableOpacity>
    );

    const { getByTestId } = render(
      <NavigationButtons
        store={mockStore}
        onNext={onNext}
        onBack={onBack}
        renderNextButton={CustomButton}
      />
    );

    expect(getByTestId('custom-next')).toBeTruthy();
    expect(getByTestId('back-button')).toBeTruthy();
  });

  it('renders custom back button when provided', () => {
    const mockStore = createMockStore(1) as WizardStoreType;
    const onNext = jest.fn();
    const onBack = jest.fn();
    const CustomButton = ({ label, onPress, disabled }: ButtonProps) => (
      <TouchableOpacity
        testID={`custom-${label?.toLowerCase()}`}
        onPress={onPress}
        disabled={disabled}
      >
        <Text>Custom {label}</Text>
      </TouchableOpacity>
    );

    const { getByTestId } = render(
      <NavigationButtons
        store={mockStore}
        onNext={onNext}
        onBack={onBack}
        renderBackButton={CustomButton}
      />
    );

    expect(getByTestId('custom-back')).toBeTruthy();
    expect(getByTestId('next-button')).toBeTruthy();
  });

  it('applies disabled styles when button is disabled', () => {
    const mockStore = {
      ...createMockStore(),
      getCanMoveNext: jest.fn().mockReturnValue(false),
    } as WizardStoreType;
    const onNext = jest.fn();
    const onBack = jest.fn();

    const { getByTestId } = render(
      <NavigationButtons
        store={mockStore}
        onNext={onNext}
        onBack={onBack}
      />
    );

    const nextButton = getByTestId('next-button');
    expect(nextButton.props.style).toContainEqual(expect.objectContaining({
      backgroundColor: '#E0E0E0'
    }));
  });

  it('maintains right alignment of next button when back button is hidden', () => {
    const mockStore = createMockStore(0) as WizardStoreType; // First step
    const onNext = jest.fn();
    const onBack = jest.fn();

    const { getByTestId } = render(
      <NavigationButtons
        store={mockStore}
        onNext={onNext}
        onBack={onBack}
      />
    );

    const container = getByTestId('next-button').parent;
    expect(container.props.style).toContainEqual(expect.objectContaining({
      justifyContent: 'flex-end'
    }));
  });

  it('handles multiple hidden steps correctly', () => {
    const mockStore = {
      ...createMockStore(2), // Third step
      getVisibleStepIndex: jest.fn().mockReturnValue(0), // First visible step
      getCurrentStep: jest.fn().mockReturnValue({ hidden: false }),
    } as WizardStoreType;
    const onNext = jest.fn();
    const onBack = jest.fn();

    const { queryByTestId } = render(
      <NavigationButtons
        store={mockStore}
        onNext={onNext}
        onBack={onBack}
      />
    );

    expect(queryByTestId('back-button')).toBeNull();
    expect(queryByTestId('next-button')).toBeTruthy();
  });
}); 