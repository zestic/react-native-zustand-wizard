import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { observer } from 'mobx-react';
import { useNavigationContext } from '../../utils/wizardUtils';
import { IWizardStore } from '../../stores/WizardStore';
import { colors } from '../../theme/colors';

type IndicatorPosition = 'above' | 'between' | 'below';

interface WizardNavigationProps {
  store: IWizardStore;
  ButtonComponent?: React.ComponentType<{
    onPress: () => void;
    title: string;
    disabled?: boolean;
    testID?: string;
    accessibilityState?: { disabled: boolean };
  }>;
  StepIndicatorComponent?: React.ComponentType<{
    currentStep: number;
    totalSteps: number;
    testID?: string;
  }>;
  indicatorPosition?: IndicatorPosition;
}

// Default button component with proper disabled styling
const DefaultButton = ({
  onPress,
  title,
  disabled,
  testID,
  accessibilityState,
}: {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  testID?: string;
  accessibilityState?: { disabled: boolean };
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={[styles.button, disabled && styles.disabledButton]}
    testID={testID}
    accessibilityState={accessibilityState}
  >
    <Text style={[styles.buttonText, disabled && styles.disabledButtonText]}>
      {title}
    </Text>
  </TouchableOpacity>
);

export const WizardNavigation = observer(
  ({
    store,
    ButtonComponent = DefaultButton,
    StepIndicatorComponent,
    indicatorPosition = 'between',
  }: WizardNavigationProps) => {
    if (!store) {
      return null;
    }

    const {
      isPreviousHidden,
      isNextDisabled,
      nextLabel,
      previousLabel,
      currentStepPosition,
      totalSteps,
      onNext,
      onPrevious,
    } = useNavigationContext();

    const renderIndicator = () =>
      StepIndicatorComponent && (
        <StepIndicatorComponent
          currentStep={currentStepPosition}
          totalSteps={totalSteps}
          testID="step-indicator"
        />
      );

    // For 'between', render: [Prev Button] [StepIndicator] [Next Button]
    if (indicatorPosition === 'between' && StepIndicatorComponent) {
      return (
        <View style={styles.container}>
          <View style={styles.rowBetween}>
            <View style={styles.buttonWrapper}>
              {!isPreviousHidden && (
                <ButtonComponent
                  onPress={onPrevious}
                  title={previousLabel || ''}
                  testID="back-button"
                  disabled={false}
                  accessibilityState={{ disabled: false }}
                />
              )}
            </View>
            <View style={styles.indicatorWrapper}>{renderIndicator()}</View>
            <View style={styles.buttonWrapper}>
              <ButtonComponent
                onPress={onNext}
                title={nextLabel || ''}
                disabled={isNextDisabled}
                testID="next-button"
                accessibilityState={{ disabled: isNextDisabled }}
              />
            </View>
          </View>
        </View>
      );
    }

    // For above/below or no indicator, render buttons in a row
    return (
      <View style={styles.container}>
        {indicatorPosition === 'above' && renderIndicator()}
        <View style={styles.rowButtons}>
          <View style={styles.buttonWrapper}>
            {!isPreviousHidden && (
              <ButtonComponent
                onPress={onPrevious}
                title={previousLabel || ''}
                testID="back-button"
                disabled={false}
                accessibilityState={{ disabled: false }}
              />
            )}
          </View>
          <View style={styles.buttonWrapper}>
            <ButtonComponent
              onPress={onNext}
              title={nextLabel || ''}
              disabled={isNextDisabled}
              testID="next-button"
              accessibilityState={{ disabled: isNextDisabled }}
            />
          </View>
        </View>
        {indicatorPosition === 'below' && renderIndicator()}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 8,
    minWidth: 80,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 8,
  },
  container: {
    alignItems: 'center',
    borderTopColor: colors.gray200,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  disabledButton: {
    backgroundColor: colors.gray200,
  },
  disabledButtonText: {
    color: colors.gray400,
  },
  indicatorWrapper: {
    alignItems: 'center',
    flexShrink: 1,
    marginHorizontal: 8,
  },
  rowBetween: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 24,
    justifyContent: 'space-between',
  },
  rowButtons: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
