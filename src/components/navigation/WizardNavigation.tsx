import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigationContext } from '../../utils/wizardUtils';
import { colors } from '../../theme/colors';
import { WizardNavigationProps } from '../../types';

// Default button component with proper disabled styling
const DefaultButton = ({
  onPress,
  title,
  disabled,
}: {
  onPress: () => void;
  title: string;
  disabled?: boolean;
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    accessibilityRole="button"
    accessibilityState={{ disabled }}
    accessibilityLabel={title}
    accessible={true}
    style={[styles.button, disabled && styles.disabledButton]}
  >
    <Text style={[styles.buttonText, disabled && styles.disabledButtonText]}>
      {title}
    </Text>
  </TouchableOpacity>
);

export const WizardNavigation: React.FC<WizardNavigationProps> = ({
  ButtonComponent = DefaultButton,
  StepIndicatorComponent,
  indicatorPosition = 'between',
}) => {
  const {
    isPreviousHidden,
    isNextDisabled,
    nextLabel,
    previousLabel,
    onNext,
    onPrevious,
    currentStepPosition,
    totalSteps,
  } = useNavigationContext();

  const renderIndicator = () =>
    StepIndicatorComponent && (
      <View
        accessibilityRole="text"
        accessibilityLabel={`Step ${currentStepPosition} of ${totalSteps}`}
      >
        <StepIndicatorComponent />
      </View>
    );

  // For 'between', render: [Prev Button] [StepIndicator] [Next Button]
  if (indicatorPosition === 'between' && StepIndicatorComponent) {
    return (
      <View style={styles.container} accessible={true}>
        <View style={styles.rowBetween}>
          <View style={styles.buttonWrapper}>
            {!isPreviousHidden && (
              <ButtonComponent
                onPress={onPrevious}
                title={previousLabel || ''}
                disabled={false}
              />
            )}
          </View>
          <View style={styles.indicatorWrapper}>{renderIndicator()}</View>
          <View style={styles.buttonWrapper}>
            <ButtonComponent
              onPress={onNext}
              title={nextLabel || ''}
              disabled={isNextDisabled}
            />
          </View>
        </View>
      </View>
    );
  }

  // For above/below or no indicator, render buttons in a row
  return (
    <View style={styles.container} accessible={true}>
      {indicatorPosition === 'above' && renderIndicator()}
      <View style={styles.rowButtons}>
        {/* Left side - Previous button or empty space */}
        <View style={styles.buttonLeft}>
          {!isPreviousHidden && (
            <ButtonComponent
              onPress={onPrevious}
              title={previousLabel || ''}
              disabled={false}
            />
          )}
        </View>
        {/* Right side - Next button */}
        <View style={styles.buttonRight}>
          <ButtonComponent
            onPress={onNext}
            title={nextLabel || ''}
            disabled={isNextDisabled}
          />
        </View>
      </View>
      {indicatorPosition === 'below' && renderIndicator()}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    minWidth: 80,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonLeft: {
    alignItems: 'flex-start',
    flex: 1,
  },
  buttonRight: {
    alignItems: 'flex-end',
    flex: 1,
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
    backgroundColor: colors.gray300,
    borderColor: colors.primaryLight,
    borderWidth: 1,
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
  },
  rowButtons: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
});
