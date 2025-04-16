import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { observer } from 'mobx-react';
import { useNavigationContext } from '../../utils/wizardUtils';
import { IWizardStore } from '../../stores/WizardStore';

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
const DefaultButton = ({ onPress, title, disabled, testID, accessibilityState }: {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  testID?: string;
  accessibilityState?: { disabled: boolean };
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={[styles.defaultButton, disabled && styles.defaultButtonDisabled]}
    testID={testID}
    accessibilityState={accessibilityState}
  >
    <Text style={[styles.defaultButtonText, disabled && styles.defaultButtonTextDisabled]}>
      {title}
    </Text>
  </TouchableOpacity>
);

export const WizardNavigation = observer(({ 
  store, 
  ButtonComponent = DefaultButton,
  StepIndicatorComponent,
  indicatorPosition = 'between'
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
    onPrevious
  } = useNavigationContext();

  const renderIndicator = () => (
    StepIndicatorComponent && (
      <StepIndicatorComponent
        currentStep={currentStepPosition}
        totalSteps={totalSteps}
        testID="step-indicator"
      />
    )
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
});

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 24,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 24,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 8,
  },
  indicatorWrapper: {
    flexShrink: 1,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  defaultButton: {
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  defaultButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  defaultButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  defaultButtonTextDisabled: {
    color: '#999999',
  },
}); 